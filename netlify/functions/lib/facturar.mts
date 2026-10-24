/**
 * Facturación electrónica de un pedido pagado.
 *
 * Reglas duras:
 *  - Solo factura pedidos en estado 'pagado'.
 *  - Guarda el id de la factura ANTES de timbrar, para que un fallo
 *    intermedio no deje facturas huérfanas en Alegra.
 *  - Si el total no cuadra con lo cobrado, NO timbra: una factura
 *    timbrada mal solo se corrige con nota crédito.
 *  - Es idempotente: se puede reintentar sin duplicar.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import {
  asegurarContacto, crearFactura, timbrar, consultarFactura,
  hoyBogota, ErrorAlegra,
  type TipoDocumento, type TipoPersona, type MedioPago
} from './alegra.mts';
import { descomponer, verificarCuadre, type LineaPedido } from './precios.mts';

/* ── Mapeos entre la tienda y los catálogos de Alegra ── */

const DOCUMENTOS: Record<string, TipoDocumento> = {
  CC: 'CC', CE: 'CE', NIT: 'NIT', TI: 'TI', RC: 'RC',
  NUIP: 'NUIP', PEP: 'PEP', PP: 'PP',
  PAS: 'PP'   // el checkout usa PAS; Alegra espera PP
};

const PERSONAS: Record<string, TipoPersona> = {
  natural: 'PERSON_ENTITY',
  juridica: 'LEGAL_ENTITY'
};

/** Wompi informa su propio método; Alegra tiene otro catálogo. */
const MEDIOS: Record<string, MedioPago> = {
  CARD: 'CREDIT_CARD',
  NEQUI: 'BANK_DEPOSIT',
  PSE: 'BANK_DEPOSIT',
  BANCOLOMBIA_TRANSFER: 'BANK_DEPOSIT',
  BANCOLOMBIA_COLLECT: 'BANK_DEPOSIT',
  DAVIPLATA: 'BANK_DEPOSIT'
};

/* ── Configuración ── */

function entero(nombre: string): number | undefined {
  const v = process.env[nombre];
  if (!v) return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

const SELECCION = `
  id, referencia, estado, subtotal_cop, envio_cop, total_cop,
  comprador_nombre, comprador_email, comprador_telefono,
  tipo_persona, tipo_documento, numero_documento, razon_social,
  envio_direccion, envio_ciudad, departamento, envio_pais,
  wompi_metodo, wompi_transaction_id,
  alegra_estado, alegra_factura_id, alegra_intentos,
  pedido_items (
    producto_id, nombre_snapshot, precio_cop, cantidad, talla,
    productos ( alegra_item_id )
  )
`;

export interface ResultadoFacturacion {
  estado: 'facturado' | 'omitido' | 'error';
  motivo?: string;
  facturaId?: string;
  numero?: string | null;
}

/* ── Flujo principal ── */

export async function facturarPedido(
  db: SupabaseClient,
  pedidoId: string
): Promise<ResultadoFacturacion> {

  const { data: p, error } = await db
    .from('pedidos').select(SELECCION).eq('id', pedidoId).single();

  if (error || !p) {
    return { estado: 'error', motivo: `Pedido no encontrado: ${error?.message ?? pedidoId}` };
  }

  // Solo se factura lo efectivamente pagado.
  if (p.estado !== 'pagado') {
    return { estado: 'omitido', motivo: `El pedido está en estado "${p.estado}"` };
  }

  // Ya cerrado por la DIAN: no hay nada que hacer.
  if (p.alegra_estado === 'aceptada') {
    return { estado: 'omitido', motivo: 'Ya fue aceptada por la DIAN', facturaId: p.alegra_factura_id };
  }

  // Si ya existe la factura, solo falta timbrarla o consultarla.
  if (p.alegra_factura_id) {
    return await continuarFactura(db, p);
  }

  try {
    const lineas = armarLineas(p);
    const desglose = descomponer(lineas);
    verificarCuadre(desglose, p.total_cop);

    const contactoId = await asegurarContacto(datosContacto(p));

    const factura = await crearFactura({
      contactoId,
      items: desglose.items.map(i => ({
        id: i.id,
        cantidad: i.cantidad,
        precio: i.precio,
        descripcion: i.descripcion,
        impuestoId: i.impuestoId
      })),
      fecha: hoyBogota(),
      plantillaId: entero('ALEGRA_PLANTILLA_FE'),
      formaPago: 'CASH',
      medioPago: MEDIOS[p.wompi_metodo ?? ''] ?? 'CREDIT_CARD',
      pagado: p.total_cop,
      cuentaPagoId: entero('ALEGRA_CUENTA_PAGO'),
      observaciones: `Pedido ${p.referencia} — tienda en línea`
    });

    // Persistir ANTES de timbrar: si el timbrado falla, la factura
    // ya quedó ligada al pedido y el reintento no la duplica.
    await db.from('pedidos').update({
      alegra_estado: 'creada',
      alegra_factura_id: factura.id,
      alegra_numero: factura.numero,
      alegra_error: null,
      alegra_at: new Date().toISOString()
    }).eq('id', p.id);

    return await continuarFactura(db, { ...p, alegra_factura_id: factura.id });

  } catch (e) {
    return await marcarFallo(db, p, e);
  }
}

/** Timbra una factura ya creada y registra el estado que informa la DIAN. */
async function continuarFactura(db: SupabaseClient, p: any): Promise<ResultadoFacturacion> {
  try {
    if (p.alegra_estado !== 'timbrada') {
      await timbrar([p.alegra_factura_id]);
      await db.from('pedidos').update({
        alegra_estado: 'timbrada',
        alegra_at: new Date().toISOString()
      }).eq('id', p.id);
    }

    // El timbrado es asíncrono: la DIAN puede seguir procesando.
    const estado = await consultarFactura(p.alegra_factura_id);

    await db.from('pedidos').update({
      alegra_estado: estadoLocal(estado.emision),
      alegra_emision: estado.emision,
      alegra_numero: estado.numero ?? p.alegra_numero,
      alegra_cufe: estado.cufe,
      alegra_error: estado.emision === 'STAMPED_AND_REJECTED'
        ? 'La DIAN rechazó la factura; revisar en Alegra'
        : null,
      alegra_at: new Date().toISOString()
    }).eq('id', p.id);

    return {
      estado: 'facturado',
      facturaId: estado.id,
      numero: estado.numero
    };

  } catch (e) {
    return await marcarFallo(db, p, e);
  }
}

/** Traduce el estado de emisión de Alegra al estado local del pedido. */
function estadoLocal(emision: string | null): string {
  switch (emision) {
    case 'STAMPED_AND_ACCEPTED':
    case 'STAMPED_AND_ACCEPTED_WITH_OBSERVATIONS':
      return 'aceptada';
    case 'STAMPED_AND_REJECTED':
      return 'rechazada';
    case 'STAMPED_AND_WAITING_RESPONSE':
      return 'timbrada';
    default:
      return 'timbrada';
  }
}

async function marcarFallo(db: SupabaseClient, p: any, e: unknown): Promise<ResultadoFacturacion> {
  const motivo = e instanceof Error ? e.message : String(e);

  // Un 4xx no se arregla reintentando: se marca como error definitivo.
  const definitivo = e instanceof ErrorAlegra && !e.reintentable;

  await db.from('pedidos').update({
    alegra_estado: definitivo ? 'error' : 'pendiente',
    alegra_error: motivo.slice(0, 500),
    alegra_intentos: (p.alegra_intentos ?? 0) + 1,
    alegra_at: new Date().toISOString()
  }).eq('id', p.id);

  console.error(`[facturar] pedido ${p.referencia}: ${motivo}`);
  return { estado: 'error', motivo };
}

/* ── Armado de datos ── */

function armarLineas(p: any): LineaPedido[] {
  const items = p.pedido_items ?? [];
  if (!items.length) throw new Error('El pedido no tiene items');

  const lineas: LineaPedido[] = items.map((i: any) => {
    const alegraId = i.productos?.alegra_item_id;
    if (!alegraId) {
      throw new Error(
        `El producto "${i.nombre_snapshot}" no tiene alegra_item_id; ` +
        `créalo en Alegra y guarda su id en productos.alegra_item_id`
      );
    }
    return {
      alegraItemId: Number(alegraId),
      cantidad: i.cantidad,
      precioConIva: i.precio_cop,
      descripcion: i.talla ? `${i.nombre_snapshot} — Talla ${i.talla}` : i.nombre_snapshot,
      impuestoId: entero('ALEGRA_IMPUESTO_IVA')
    };
  });

  // El envío no lleva IVA: tarifa 0 y sin impuesto asociado.
  if (p.envio_cop > 0) {
    const itemEnvio = entero('ALEGRA_ITEM_ENVIO');
    if (!itemEnvio) {
      throw new Error('Falta ALEGRA_ITEM_ENVIO: crea el item "Envío" sin impuesto en Alegra');
    }
    lineas.push({
      alegraItemId: itemEnvio,
      cantidad: 1,
      precioConIva: p.envio_cop,
      descripcion: 'Envío',
      tarifaIva: 0
    });
  }

  return lineas;
}

function datosContacto(p: any) {
  const persona = PERSONAS[p.tipo_persona ?? 'natural'] ?? 'PERSON_ENTITY';
  const tipoDoc = DOCUMENTOS[(p.tipo_documento ?? '').toUpperCase()];

  if (!tipoDoc) {
    throw new Error(`Tipo de documento no reconocido: "${p.tipo_documento}"`);
  }
  if (!p.numero_documento) {
    throw new Error('El pedido no tiene número de documento del comprador');
  }

  const nombre = persona === 'LEGAL_ENTITY'
    ? (p.razon_social || p.comprador_nombre)
    : p.comprador_nombre;

  if (!nombre) throw new Error('El pedido no tiene nombre ni razón social');

  return {
    nombre,
    tipoDocumento: tipoDoc,
    identificacion: String(p.numero_documento).trim(),
    tipoPersona: persona,
    correo: p.comprador_email ?? undefined,
    telefono: p.comprador_telefono ?? undefined,
    direccion: p.envio_direccion ?? undefined,
    ciudad: p.envio_ciudad ?? undefined,
    departamento: p.departamento ?? undefined
  };
}