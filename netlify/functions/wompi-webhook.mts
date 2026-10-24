import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

/** Lee un valor anidado por ruta: "transaction.amount_in_cents" */
function porRuta(objeto: any, ruta: string): string {
  return String(ruta.split('.').reduce((o, k) => o?.[k], objeto) ?? '');
}

const MAPA_ESTADOS: Record<string, string> = {
  APPROVED: 'pagado',
  DECLINED: 'cancelado',
  VOIDED: 'cancelado',
  ERROR: 'cancelado'
};

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  let evento: any;
  try {
    evento = await req.json();
  } catch {
    return new Response('Cuerpo inválido', { status: 400 });
  }

  // ── Validación de la firma del evento ──────────────────
  const firma = evento?.signature;
  const propiedades: string[] = firma?.properties ?? [];

  if (!firma?.checksum || !propiedades.length || !evento?.timestamp) {
    console.warn('Evento sin firma');
    return new Response('Evento sin firma', { status: 400 });
  }

  const concatenado = propiedades.map(p => porRuta(evento.data, p)).join('');
  const esperado = createHash('sha256')
    .update(`${concatenado}${evento.timestamp}${process.env.WOMPI_EVENTS_SECRET}`)
    .digest('hex')
    .toUpperCase();

  if (esperado !== String(firma.checksum).toUpperCase()) {
    console.warn('Firma de evento inválida');
    return new Response('Firma inválida', { status: 401 });
  }

  // ── Procesamiento ──────────────────────────────────────
  const tx = evento?.data?.transaction;
  if (!tx?.reference) return new Response('ok');          // evento que no nos interesa

  const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

  const { data: pedido } = await db
    .from('pedidos')
    .select('id, estado')
    .eq('referencia', tx.reference)
    .maybeSingle();

  if (!pedido) {
    console.warn('Referencia desconocida:', tx.reference);
    return new Response('ok');                            // 200 para que Wompi no reintente
  }

  // Wompi reintenta: si ya quedó pagado, no volvemos a descontar inventario.
  if (pedido.estado === 'pagado') return new Response('ok');

  const nuevoEstado = MAPA_ESTADOS[tx.status] ?? 'pendiente_pago';

  await db.from('pedidos').update({
    estado: nuevoEstado,
    wompi_transaction_id: tx.id,
    wompi_estado: tx.status,
    wompi_metodo: tx.payment_method_type ?? null,
    pagado_en: tx.status === 'APPROVED' ? new Date().toISOString() : null
  }).eq('id', pedido.id);

  if (tx.status === 'APPROVED') {
    const { error } = await db.rpc('descontar_stock', { p_pedido_id: pedido.id });
    if (error) console.error('No se pudo descontar inventario:', error);
  }

  console.log(`Pedido ${tx.reference} → ${nuevoEstado} (${tx.status})`);
  return new Response('ok');
};