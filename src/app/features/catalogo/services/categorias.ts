// features/catalogo/services/categorias.ts
import { Injectable, inject } from '@angular/core';
import { Supabase } from '../../../core/supabase/supabase';
import { Idioma, IDIOMA_POR_DEFECTO } from '../../../core/i18n/idioma';
import { Categoria } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class Categorias {
  private readonly db = inject(Supabase).client;
  private readonly idioma = inject(Idioma);

  async listar(): Promise<Categoria[]> {
    const { data, error } = await this.db
      .from('categorias')
      .select('id, slug, nombre, orden')
      .eq('activa', true)
      .order('orden');

    if (error) throw new Error(`No se pudieron cargar las categorías: ${error.message}`);

    const l = this.idioma.actual();
    return (data ?? []).map(f => ({
      id: f.id,
      slug: f.slug,
      nombre: f.nombre?.[l] ?? f.nombre?.[IDIOMA_POR_DEFECTO] ?? f.slug,
      orden: f.orden
    }));
  }
}