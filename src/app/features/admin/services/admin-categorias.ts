import { Injectable, inject } from '@angular/core';
import { Supabase } from '../../../core/supabase/supabase';
import { TextoMultiidioma } from './admin-productos';

export interface CategoriaAdmin {
  id: string;
  slug: string;
  nombre: TextoMultiidioma;
}

@Injectable({ providedIn: 'root' })
export class AdminCategorias {
  private readonly db = inject(Supabase).client;

  async listar(): Promise<CategoriaAdmin[]> {
    const { data, error } = await this.db
      .from('categorias')
      .select('id, slug, nombre')
      .order('orden');

    if (error) throw new Error(`No se pudieron cargar las categorías: ${error.message}`);
    return (data ?? []).map(f => ({ id: f.id, slug: f.slug, nombre: f.nombre ?? {} }));
  }
}