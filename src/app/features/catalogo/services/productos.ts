import { Injectable, inject } from '@angular/core';
import { Supabase } from '../../../core/supabase/supabase';
import { Idioma, IDIOMA_POR_DEFECTO } from '../../../core/i18n/idioma';
import { Producto } from '../models/producto.model';

const CAMPOS = `
  id, slug, precio_cop, imagen_url, imagenes, tallas, nombre, descripcion,
  categorias!inner(slug, nombre)
`;

export const PRODUCTOS_POR_PAGINA = 10;

export interface PaginaProductos {
  productos: Producto[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class Productos {
  private readonly db = inject(Supabase).client;
  private readonly idioma = inject(Idioma);

  async listar(categoriaSlug?: string, pagina = 1): Promise<PaginaProductos> {
    const desde = (pagina - 1) * PRODUCTOS_POR_PAGINA;
    const hasta = desde + PRODUCTOS_POR_PAGINA - 1;

    let q = this.db
      .from('productos')
      .select(CAMPOS, { count: 'exact' })
      .eq('activo', true);

    if (categoriaSlug) q = q.eq('categorias.slug', categoriaSlug);

    const { data, error, count } = await q
      .order('destacado', { ascending: false })
      .order('creado_en', { ascending: false })
      .range(desde, hasta);

    if (error) throw new Error(`No se pudo cargar el catálogo: ${error.message}`);

    return {
      productos: (data ?? []).map(f => this.aProducto(f)),
      total: count ?? 0
    };
  }

  async porSlug(slug: string): Promise<Producto | null> {
    const { data, error } = await this.db
      .from('productos').select(CAMPOS)
      .eq('slug', slug).eq('activo', true)
      .maybeSingle();

    if (error) throw new Error(`No se pudo cargar el producto: ${error.message}`);
    return data ? this.aProducto(data) : null;
  }

  /** Otros productos de la misma categoría, sin incluir el actual. */
  async relacionados(categoriaSlug: string, excluirId: string, limite = 4): Promise<Producto[]> {
    if (!categoriaSlug || !excluirId) return [];

    const { data, error } = await this.db
      .from('productos')
      .select(CAMPOS)
      .eq('activo', true)
      .eq('categorias.slug', categoriaSlug)
      .neq('id', excluirId)
      .order('destacado', { ascending: false })
      .limit(limite);

    // Un fallo aquí no debe tumbar la ficha del producto.
    if (error) return [];
    return (data ?? []).map(f => this.aProducto(f));
  }

  private aProducto(f: any): Producto {
    const l = this.idioma.actual();

    const extras: string[] = Array.isArray(f.imagenes) ? f.imagenes.filter(Boolean) : [];
    const principal: string = f.imagen_url || extras[0] || '';
    const galeria = principal
      ? [principal, ...extras.filter(u => u !== principal)]
      : [];

    return {
      id: f.id,
      slug: f.slug,
      nombre: f.nombre?.[l] ?? f.nombre?.[IDIOMA_POR_DEFECTO] ?? '',
      descripcion: f.descripcion?.[l] ?? f.descripcion?.[IDIOMA_POR_DEFECTO] ?? '',
      precio: f.precio_cop,
      imagenUrl: principal,
      imagenes: galeria,
      tallas: f.tallas ?? [],
      categoriaSlug: f.categorias?.slug ?? '',
      categoriaNombre: f.categorias?.nombre?.[l] ?? f.categorias?.nombre?.[IDIOMA_POR_DEFECTO] ?? ''
    };
  }
}