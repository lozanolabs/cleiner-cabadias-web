import { Injectable, PLATFORM_ID, computed, inject, resource } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Supabase } from '../supabase/supabase';
import { Idioma } from './idioma';
import { MONEDA_POR_IDIOMA, Moneda } from './moneda';

function periodoActual(): string {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-01`;
}

interface FilaTasa {
  moneda: string;
  periodo: string;
  cop_por_unidad: number | string;
}

@Injectable({ providedIn: 'root' })
export class Conversion {
  private readonly db = inject(Supabase).client;
  private readonly idioma = inject(Idioma);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly esNavegador = isPlatformBrowser(this.platformId);

  readonly moneda = computed<Moneda | null>(() => MONEDA_POR_IDIOMA[this.idioma.actual()]);

  private readonly tasas = resource({
    params: () => ({ moneda: this.moneda()?.codigo }),

    loader: async ({ params }) => {
      // Español: es la moneda base, no hay nada que convertir.
      if (!params.moneda) return {} as Record<string, number>;

      const { data } = await this.db.rpc('tasas_vigentes');
      const filas = (data ?? []) as FilaTasa[];

      const alDia = filas.some(f => f.periodo === periodoActual());
      if ((filas.length && alDia) || !this.esNavegador) return this.aMapa(filas);

      // Falta el período del mes: pedimos a la función que lo cargue.
      try {
        const res = await fetch('/.netlify/functions/tasas');
        const json = await res.json();
        return this.aMapa(json.tasas ?? []);
      } catch {
        return this.aMapa(filas);
      }
    }
  });

  /** Devuelve null si el idioma usa la moneda base o si no hay tasa disponible. */
  convertir(precioCop: number): number | null {
    const m = this.moneda();
    if (!m) return null;

    const tasa = this.tasas.value()?.[m.codigo];
    if (!tasa || tasa <= 0) return null;

    return precioCop / tasa;
  }

  private aMapa(filas: FilaTasa[]): Record<string, number> {
    return Object.fromEntries(filas.map(f => [f.moneda, Number(f.cop_por_unidad)]));
  }
}