import { createClient } from '@supabase/supabase-js';

const MONEDAS = ['EUR', 'BRL', 'GBP', 'CAD'];

function periodoActual(): string {
  const h = new Date();
  return `${h.getUTCFullYear()}-${String(h.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

async function traer(url: string, ms = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`${url} respondió ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

export default async () => {
  const periodo = periodoActual();
  const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

  const { data: existentes } = await db
    .from('tasas_cambio')
    .select('moneda, periodo, cop_por_unidad')
    .eq('periodo', periodo);

  if (existentes?.length) {
    return Response.json({ periodo, tasas: existentes, origen: 'cache' });
  }

  try {
    const trm = await traer(
      'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde DESC'
    );
    const usd = Number(trm?.[0]?.valor);
    if (!usd || usd <= 0) throw new Error('TRM inválida');

    const fx = await traer(`https://api.frankfurter.app/latest?from=USD&to=${MONEDAS.join(',')}`);

    const filas = [
      { moneda: 'USD', periodo, cop_por_unidad: usd.toFixed(2), fuente: 'TRM datos.gov.co' },
      ...MONEDAS
        .filter(m => fx?.rates?.[m] > 0)
        .map(m => ({
          moneda: m, periodo,
          cop_por_unidad: (usd / fx.rates[m]).toFixed(2),
          fuente: 'TRM + BCE'
        }))
    ];

    const { error } = await db
      .from('tasas_cambio')
      .upsert(filas, { onConflict: 'moneda,periodo' });
    if (error) throw error;

    return Response.json({ periodo, tasas: filas, origen: 'consulta' });

  } catch (e) {
    console.error('Fallo al cargar tasas:', e);
    const { data } = await db.rpc('tasas_vigentes');
    return Response.json({ periodo: null, tasas: data ?? [], origen: 'respaldo' });
  }
};