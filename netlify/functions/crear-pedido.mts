import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

interface ItemEntrante { productoId: string; cantidad: number; talla?: string; }

const PAIS_PERMITIDO = 'CO';
const MONEDA = 'COP';

function referencia(): string {
  const d = new Date();
  const fecha = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const azar = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CC-${fecha}-${azar}`;
}

/** Claves literales (Wompi las usa con dos puntos), valores codificados. */
function armarQuery(pares: Record<string, string>): string {
  return Object.entries(pares)
    .filter(([, v]) => v !== '' && v != null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Método no permitido' }, { status: 405 });
  }

  const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

  let cuerpo: any;
  try {
    cuerpo = await req.json();
  } catch {
    return Response.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const items: ItemEntrante[] = Array.isArray(cuerpo.items) ? cuerpo.items : [];
  const comprador = cuerpo.comprador ?? {};

  if (!items.length) {
    return Response.json({ error: 'El carrito está vacío' }, { status: 400 });
  }

  // ── Validación mínima del comprador ────────────────────
  const obligatorios = ['email', 'tipoPersona', 'tipoDocumento', 'numeroDocumento',
                        'nombre', 'pais', 'departamento', 'ciudad', 'direccion', 'telefono'];
  const faltantes = obligatorios.filter(c => !String(comprador[c] ?? '').trim());
  if (faltantes.length) {
    return Response.json({ error: 'Faltan datos obligatorios', campos: faltantes }, { status: 400 });
  }

  if (!comprador.aceptaTerminos || !comprador.aceptaDatos) {
    return Response.json({ error: 'Debes aceptar los términos y la política de datos' }, { status: 400 });
  }

  if (comprador.pais !== PAIS_PERMITIDO) {
    return Response.json({ error: 'Por ahora solo despachamos dentro de Colombia' }, { status: 400 });
  }

  // ── Precios reales, tomados de la base ─────────────────
  const ids = [...new Set(items.map(i => i.productoId))];

  const { data: productos, error: errProd } = await db
    .from('productos')
    .select('id, nombre, precio_cop, stock, activo')
    .in('id', ids);

  if (errProd || !productos) {
    return Response.json({ error: 'No se pudo validar el carrito' }, { status: 500 });
  }

  const porId = new Map(productos.map(p => [p.id, p]));
  const lineas: any[] = [];
  let subtotal = 0;

  for (const item of items) {
    const p = porId.get(item.productoId);
    const cantidad = Math.max(1, Math.floor(Number(item.cantidad) || 0));

    if (!p || !p.activo) {
      return Response.json({ error: 'Uno de los productos ya no está disponible' }, { status: 409 });
    }
    if (p.stock < cantidad) {
      return Response.json(
        { error: `No hay suficientes unidades de "${p.nombre?.es ?? ''}"`, productoId: p.id },
        { status: 409 }
      );
    }

    subtotal += p.precio_cop * cantidad;
    lineas.push({
      producto_id: p.id,
      nombre_snapshot: p.nombre?.es ?? '',
      precio_cop: p.precio_cop,      // el precio real, no el del navegador
      cantidad,
      talla: item.talla ?? null
    });
  }

  // ── Envío, desde la configuración ──────────────────────
  const { data: cfg } = await db
    .from('configuracion').select('valor').eq('clave', 'envio').maybeSingle();

  const tarifa = Number(cfg?.valor?.tarifa_cop ?? 0);
  const gratisDesde = cfg?.valor?.gratis_desde_cop;
  const envio = (gratisDesde && subtotal >= Number(gratisDesde)) ? 0 : tarifa;

  const total = subtotal + envio;

  // ── Tasa vigente, para la factura ──────────────────────
  const { data: tasas } = await db.rpc('tasas_vigentes');
  const tasaMoneda = comprador.monedaVista ?? null;
  const tasaFila = (tasas ?? []).find((t: any) => t.moneda === tasaMoneda);

  // ── Creación del pedido ────────────────────────────────
  const ref = referencia();

  const { data: pedido, error: errPedido } = await db
    .from('pedidos')
    .insert({
      referencia: ref,
      estado: 'pendiente_pago',
      comprador_nombre: String(comprador.nombre).trim(),
      comprador_email: String(comprador.email).trim().toLowerCase(),
      comprador_telefono: String(comprador.telefono).trim(),
      tipo_persona: comprador.tipoPersona,
      tipo_documento: comprador.tipoDocumento,
      numero_documento: String(comprador.numeroDocumento).trim(),
      razon_social: comprador.tipoPersona === 'juridica' ? String(comprador.nombre).trim() : null,
      envio_pais: comprador.pais,
      departamento: comprador.departamento,
      envio_ciudad: String(comprador.ciudad).trim(),
      envio_direccion: String(comprador.direccion).trim(),
      envio_detalle: comprador.detalle ? String(comprador.detalle).trim() : null,
      subtotal_cop: subtotal,
      envio_cop: envio,
      total_cop: total,
      idioma: comprador.idioma ?? 'es',
      acepta_terminos: true,
      acepta_datos: true,
      tasa_periodo: tasaFila?.periodo ?? null,
      tasa_moneda: tasaMoneda,
      tasa_cop_por_unidad: tasaFila?.cop_por_unidad ?? null
    })
    .select('id, referencia')
    .single();

  if (errPedido || !pedido) {
    console.error('Error al crear el pedido:', errPedido);
    return Response.json({ error: 'No se pudo crear el pedido' }, { status: 500 });
  }

  const { error: errItems } = await db
    .from('pedido_items')
    .insert(lineas.map(l => ({ ...l, pedido_id: pedido.id })));

  if (errItems) {
    await db.from('pedidos').delete().eq('id', pedido.id);   // no dejar pedidos huérfanos
    return Response.json({ error: 'No se pudo registrar el detalle del pedido' }, { status: 500 });
  }

  // ── Firma de integridad y URL de pago ──────────────────
  const centavos = total * 100;                  // el peso no usa decimales

  const firma = createHash('sha256')
    .update(`${ref}${centavos}${MONEDA}${process.env.WOMPI_INTEGRITY_SECRET}`)
    .digest('hex');

  const sitio = process.env.URL ?? '';
  const esLocal = !sitio || sitio.includes('localhost') || sitio.includes('127.0.0.1');
  const soloDigitos = (v: unknown) => String(v ?? '').replace(/\D/g, '');

  const pares: Record<string, string> = {
    'public-key': process.env.WOMPI_PUBLIC_KEY!,
    'currency': MONEDA,
    'amount-in-cents': String(centavos),
    'reference': ref,
    'signature:integrity': firma,
    'customer-data:email': String(comprador.email).trim().toLowerCase(),
    'customer-data:full-name': String(comprador.nombre).trim(),
    'customer-data:phone-number': soloDigitos(comprador.telefono),
    'customer-data:legal-id': String(comprador.numeroDocumento).trim(),
    'customer-data:legal-id-type': comprador.tipoDocumento
  };

  // En local no mandamos redirect-url: una URL a localhost dentro de un
  // parámetro dispara los filtros de seguridad del CDN de Wompi.
  if (!esLocal) {
    pares['redirect-url'] = `${sitio}/checkout/respuesta`;
  }

  const urlPago = `https://checkout.wompi.co/p/?${armarQuery(pares)}`;

  return Response.json({
    referencia: pedido.referencia,
    pedidoId: pedido.id,
    subtotalCop: subtotal,
    envioCop: envio,
    totalCop: total,
    urlPago
  });
};