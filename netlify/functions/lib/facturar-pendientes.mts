import type { Config, Context } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { facturarPedido } from './lib/facturar.mts';

const MAXIMO_POR_CORRIDA = 10;
const MAXIMO_INTENTOS = 5;

export default async (_peticion: Request, _contexto: Context) => {
  const url = process.env.SUPABASE_URL;
  const llave = process.env.SUPABASE_SERVICE_ROLE;

  if (!url || !llave) {
    console.error('[facturar-pendientes] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE');
    return new Response('Configuración incompleta', { status: 500 });
  }

  const db = createClient(url, llave, { auth: { persistSession: false } });

  const { data: pendientes, error } = await db
    .from('pedidos')
    .select('id, referencia')
    .eq('estado', 'pagado')
    .in('alegra_estado', ['pendiente', 'creada', 'timbrada'])
    .lt('alegra_intentos', MAXIMO_INTENTOS)
    .order('creado_en', { ascending: true })
    .limit(MAXIMO_POR_CORRIDA);

  if (error) {
    console.error('[facturar-pendientes]', error.message);
    return new Response(error.message, { status: 500 });
  }

  if (!pendientes?.length) {
    return Response.json({ procesados: 0 });
  }

  const resultados = [];
  for (const p of pendientes) {
    const r = await facturarPedido(db, p.id);
    resultados.push({ referencia: p.referencia, ...r });
  }

  const conError = resultados.filter(r => r.estado === 'error').length;
  console.log(`[facturar-pendientes] ${resultados.length} procesados, ${conError} con error`);

  return Response.json({ procesados: resultados.length, resultados });
};

export const config: Config = {
  schedule: '*/5 * * * *'
};