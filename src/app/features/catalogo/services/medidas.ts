import { Injectable, computed, inject, resource } from '@angular/core';
import { Supabase } from '../../../core/supabase/supabase';
import { MedidaTalla, tieneMedidas } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class Medidas {
  private readonly db = inject(Supabase).client;

  /** Una sola tabla para toda la tienda: se carga una vez y se reutiliza. */
  private readonly recurso = resource({
    loader: async (): Promise<MedidaTalla[]> => {
      const { data, error } = await this.db
        .from('medidas_talla')
        .select('talla, orden, busto, cintura, cadera, contorno_brazo, ancho_espalda, largo_brazo')
        .order('orden');

      // Sin medidas el producto se sigue vendiendo: no vale la pena fallar.
      if (error) return [];

      return (data ?? []).map((m: any) => ({
        talla: m.talla,
        orden: m.orden,
        busto: m.busto,
        cintura: m.cintura,
        cadera: m.cadera,
        contornoBrazo: m.contorno_brazo,
        anchoEspalda: m.ancho_espalda,
        largoBrazo: m.largo_brazo
      }));
    }
  });

  readonly todas = computed(() => this.recurso.value() ?? []);

  /** Las medidas de las tallas indicadas, en orden, omitiendo las que no tienen. */
  para(tallas: string[]): MedidaTalla[] {
    const pedidas = new Set(tallas);
    return this.todas()
      .filter(m => pedidas.has(m.talla) && tieneMedidas(m))
      .sort((a, b) => a.orden - b.orden);
  }
}