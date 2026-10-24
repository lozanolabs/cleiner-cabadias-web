/**
 * Cliente de la API de Alegra (Colombia).
 * No conoce el esquema de la tienda: recibe datos planos y devuelve
 * resultados planos, para poder probarlo de forma aislada.
 *
 * La descomposición del IVA vive en _precios.mts, no acá.
 */

const BASE = 'https://api.alegra.com/api/v1';
const TIEMPO_LIMITE_MS = 15_000;

/* ── Catálogos verificados en la doc de Alegra para Colombia ── */

export type TipoDocumento =
  | 'RC' | 'TI' | 'CC' | 'TE' | 'CE' | 'NIT'
  | 'PP' | 'PEP' | 'DIE' | 'NUIP' | 'FOREIGN_NIT';

export type TipoPersona = 'PERSON_ENTITY' | 'LEGAL_ENTITY';

export type Regimen =
  | 'SIMPLIFIED_REGIME' | 'COMMON_REGIME'
  | 'NATIONAL_CONSUMPTION_TAX' | 'INC_IVA_RESPONSIBLE';

export type FormaPago = 'CASH' | 'CREDIT';

export type MedioPago =
  | 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_DEPOSIT' | 'CHECK';

export type EstadoEmision =
  | 'PENDING'
  | 'STAMPED_AND_WAITING_RESPONSE'
  | 'STAMPED_AND_ACCEPTED'
  | 'STAMPED_AND_REJECTED'
  | 'STAMPED_AND_ACCEPTED_WITH_OBSERVATIONS';

/* ── Entradas ── */

export interface DatosContacto {
  nombre: string;
  tipoDocumento: TipoDocumento;
  identificacion: string;
  tipoPersona?: TipoPersona;
  regimen?: Regimen;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
}

export interface ItemFactura {
  /** id del producto en Alegra, NO el uuid de Supabase */
  id: number;
  cantidad: number;
  /** precio unitario SIN IVA */
  precio: number;
  descripcion?: string;
  /** id de la tasa de impuesto en Alegra; omitir si el item ya la trae configurada */
  impuestoId?: number;
}

export interface DatosFactura {
  contactoId: number;
  items: ItemFactura[];
  /** yyyy-MM-dd */
  fecha: string;
  plantillaId?: number;
  formaPago?: FormaPago;
  medioPago?: MedioPago;
  /** monto efectivamente pagado, para registrar el pago en la factura */
  pagado?: number;
  cuentaPagoId?: number;
  observaciones?: string;
}

/* ── Resultados ── */

export interface FacturaCreada {
  id: string;
  numero: string | null;
  total: number | null;
}

export interface EstadoFactura {
  id: string;
  numero: string | null;
  emision: EstadoEmision | null;
  /** CUFE/UUID que asigna la DIAN; llega solo cuando ya fue aceptada */
  cufe: string | null;
  legal: string | null;
}

/* ── Infraestructura ── */

export class ErrorAlegra extends Error {
  constructor(
    mensaje: string,
    readonly estado: number,
    readonly cuerpo?: unknown
  ) {
    super(mensaje);
    this.name = 'ErrorAlegra';
  }

  /** Un 4xx no se arregla reintentando; un 5xx o un fallo de red sí. */
  get reintentable(): boolean {
    return this.estado === 0 || this.estado === 429 || this.estado >= 500;
  }
}

function autorizacion(): string {
  const usuario = process.env.ALEGRA_USUARIO;
  const token = process.env.ALEGRA_TOKEN;
  if (!usuario || !token) {
    throw new ErrorAlegra('Faltan las variables ALEGRA_USUARIO o ALEGRA_TOKEN', 0);
  }
  return `Basic ${Buffer.from(`${usuario}:${token}`).toString('base64')}`;
}

function jsonSeguro(texto: string): unknown {
  try { return JSON.parse(texto); } catch { return texto; }
}

/** Alegra devuelve el detalle del error en distintos lugares según el endpoint. */
function mensajeDeError(cuerpo: unknown): string | null {
  if (!cuerpo || typeof cuerpo !== 'object') {
    return typeof cuerpo === 'string' && cuerpo ? cuerpo : null;
  }
  const c = cuerpo as Record<string, any>;
  const directo = c.message ?? c.error ?? c.detail;
  if (typeof directo === 'string') return directo;
  if (typeof c.message === 'object' && c.message?.message) return String(c.message.message);
  if (Array.isArray(c.errors) && c.errors.length) {
    return c.errors.map((e: any) => e?.message ?? JSON.stringify(e)).join(' | ');
  }
  return null;
}

async function pedir<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      ...init,
      signal: AbortSignal.timeout(TIEMPO_LIMITE_MS),
      headers: {
        authorization: autorizacion(),
        accept: 'application/json',
        ...(init.body ? { 'content-type': 'application/json' } : {}),
        ...(init.headers ?? {})
      }
    });
  } catch (e) {
    const causa = e instanceof Error ? e.message : String(e);
    throw new ErrorAlegra(`No se pudo contactar a Alegra: ${causa}`, 0);
  }

  const texto = await respuesta.text();
  const cuerpo = texto ? jsonSeguro(texto) : null;

  if (!respuesta.ok) {
    throw new ErrorAlegra(
      mensajeDeError(cuerpo) ?? `Alegra respondió ${respuesta.status}`,
      respuesta.status,
      cuerpo
    );
  }

  return cuerpo as T;
}

/* ── Contactos ── */

/** Lee la identificación sin asumir si Alegra la devuelve plana o como objeto. */
function identificacionDe(contacto: any): string {
  const i = contacto?.identification;
  if (typeof i === 'string') return i.trim();
  if (i && typeof i === 'object') return String(i.number ?? '').trim();
  return '';
}

export async function buscarContacto(identificacion: string): Promise<number | null> {
  const q = encodeURIComponent(identificacion.trim());
  const lista = await pedir<any[]>(`/contacts?query=${q}&limit=30`);
  const exacto = (lista ?? []).find(c => identificacionDe(c) === identificacion.trim());
  return exacto ? Number(exacto.id) : null;
}

export async function crearContacto(datos: DatosContacto): Promise<number> {
  const cuerpo: Record<string, unknown> = {
    name: datos.nombre.trim(),
    identification: {
      type: datos.tipoDocumento,
      number: datos.identificacion.trim()
    },
    kindOfPerson: datos.tipoPersona ?? 'PERSON_ENTITY',
    regime: datos.regimen ?? 'SIMPLIFIED_REGIME',
    type: ['client'],
    status: 'active',
    ignoreRepeated: false
  };

  if (datos.correo) cuerpo.email = datos.correo.trim();
  if (datos.telefono) cuerpo.phonePrimary = datos.telefono.trim();

  if (datos.direccion || datos.ciudad || datos.departamento) {
    cuerpo.address = {
      ...(datos.direccion ? { address: datos.direccion } : {}),
      ...(datos.ciudad ? { city: datos.ciudad } : {}),
      ...(datos.departamento ? { department: datos.departamento } : {})
    };
  }

  const creado = await pedir<any>('/contacts', {
    method: 'POST',
    body: JSON.stringify(cuerpo)
  });

  return Number(creado.id);
}

/** Busca por identificación y crea solo si no existe. Idempotente. */
export async function asegurarContacto(datos: DatosContacto): Promise<number> {
  const existente = await buscarContacto(datos.identificacion);
  if (existente) return existente;

  try {
    return await crearContacto(datos);
  } catch (e) {
    // Carrera: otro proceso lo creó entre la búsqueda y el POST.
    if (e instanceof ErrorAlegra && e.estado === 400) {
      const reintento = await buscarContacto(datos.identificacion);
      if (reintento) return reintento;
    }
    throw e;
  }
}

/* ── Facturas ── */

export async function crearFactura(datos: DatosFactura): Promise<FacturaCreada> {
  const cuerpo: Record<string, unknown> = {
    client: datos.contactoId,
    date: datos.fecha,
    dueDate: datos.fecha,
    status: 'open',
    type: 'NATIONAL',
    operationType: 'STANDARD',
    paymentForm: datos.formaPago ?? 'CASH',
    paymentMethod: datos.medioPago ?? 'CREDIT_CARD',
    items: datos.items.map(i => ({
      id: i.id,
      quantity: i.cantidad,
      price: i.precio,
      ...(i.descripcion ? { description: i.descripcion } : {}),
      ...(i.impuestoId ? { tax: [{ id: i.impuestoId }] } : {})
    }))
  };

  if (datos.plantillaId) cuerpo.numberTemplate = { id: datos.plantillaId };
  if (datos.observaciones) cuerpo.observations = datos.observaciones;

  // La venta ya está cobrada por Wompi: la factura nace pagada.
  if (datos.pagado && datos.pagado > 0) {
    cuerpo.payments = [{
      date: datos.fecha,
      amount: datos.pagado,
      paymentMethod: 'credit-card',
      ...(datos.cuentaPagoId ? { account: { id: datos.cuentaPagoId } } : {})
    }];
  }

  const factura = await pedir<any>('/invoices', {
    method: 'POST',
    body: JSON.stringify(cuerpo)
  });

  return {
    id: String(factura.id),
    numero: factura.numberTemplate?.fullNumber ?? factura.number ?? null,
    total: typeof factura.total === 'number' ? factura.total : null
  };
}

/** Envía la factura a la DIAN. Máximo 10 por llamada. */
export async function timbrar(ids: string[]): Promise<void> {
  if (!ids.length) return;
  if (ids.length > 10) {
    throw new ErrorAlegra('Alegra timbra máximo 10 facturas por llamada', 0);
  }

  await pedir<unknown>('/invoices/stamp', {
    method: 'POST',
    body: JSON.stringify({ ids })
  });
}

/** El timbrado es asíncrono: hay que consultar para saber si la DIAN la aceptó. */
export async function consultarFactura(id: string): Promise<EstadoFactura> {
  const f = await pedir<any>(`/invoices/${encodeURIComponent(id)}`);

  return {
    id: String(f.id),
    numero: f.numberTemplate?.fullNumber ?? f.number ?? null,
    emision: (f.stamp?.emissionStatus ?? f.emissionStatus ?? null) as EstadoEmision | null,
    cufe: f.stamp?.cufe ?? f.stamp?.uuid ?? null,
    legal: f.stamp?.legalStatus ?? f.legalStatus ?? null
  };
}

/* ── Utilidades ── */

/** Fecha de hoy en Bogotá, en el formato yyyy-MM-dd que pide Alegra. */
export function hoyBogota(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}