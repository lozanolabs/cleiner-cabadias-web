import { Injectable, inject } from '@angular/core';
import { Supabase } from '../../../core/supabase/supabase';
import { CodigoIdioma } from '../../../core/i18n/idioma';

export type TextoMultiidioma = Partial<Record<CodigoIdioma, string>>;

export interface ProductoAdmin {
  id: string;
  categoriaId: string;
  categoriaSlug: string;
  slug: string;
  nombre: TextoMultiidioma;
  descripcion: TextoMultiidioma;
  precioCop: number;
  imagenUrl: string | null;
  imagenes: string[];
  tallas: string[];
  stock: number;
  destacado: boolean;
  activo: boolean;
}

export type ProductoNuevo = Omit<ProductoAdmin, 'id' | 'categoriaSlug'>;

const CAMPOS = `
  id, categoria_id, slug, nombre, descripcion, precio_cop,
  imagen_url, imagenes, tallas, stock, destacado, activo,
  categorias(slug)
`;

@Injectable({ providedIn: 'root' })
export class AdminProductos {
  private readonly db = inject(Supabase).client;

  async listar(): Promise<ProductoAdmin[]> {
    const { data, error } = await this.db
      .from('productos')
      .select(CAMPOS)
      .order('creado_en', { ascending: false });

    if (error) throw new Error(`No se pudieron cargar los productos: ${error.message}`);
    return (data ?? []).map(f => this.mapear(f));
  }

  async porId(id: string): Promise<ProductoAdmin | null> {
    const { data, error } = await this.db
      .from('productos').select(CAMPOS).eq('id', id).maybeSingle();

    if (error) throw new Error(`No se pudo cargar el producto: ${error.message}`);
    return data ? this.mapear(data) : null;
  }

  async crear(p: ProductoNuevo): Promise<string> {
    const { data, error } = await this.db
      .from('productos').insert(this.aFila(p)).select('id').single();

    if (error) throw new Error(this.traducir(error));
    return data.id;
  }

  async actualizar(id: string, p: ProductoNuevo): Promise<void> {
    const { error } = await this.db
      .from('productos').update(this.aFila(p)).eq('id', id);

    if (error) throw new Error(this.traducir(error));
  }

  /** Desactiva en vez de borrar: los pedidos existentes lo referencian. */
  async alternarActivo(id: string, activo: boolean): Promise<void> {
    const { error } = await this.db.from('productos').update({ activo }).eq('id', id);
    if (error) throw new Error(`No se pudo actualizar: ${error.message}`);
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await this.db.from('productos').delete().eq('id', id);
    if (error) throw new Error(this.traducir(error));
  }

  /** Sube la imagen al bucket y devuelve su URL pública. */
  async subirImagen(archivo: File, slug: string): Promise<string> {
    const ext = archivo.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const ruta = `${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { error } = await this.db.storage
      .from('productos')
      .upload(ruta, archivo, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);

    const { data } = this.db.storage.from('productos').getPublicUrl(ruta);
    return data.publicUrl;
  }

  private mapear(f: any): ProductoAdmin {
    const extras: string[] = Array.isArray(f.imagenes) ? f.imagenes.filter(Boolean) : [];

    return {
      id: f.id,
      categoriaId: f.categoria_id,
      categoriaSlug: f.categorias?.slug ?? '',
      slug: f.slug,
      nombre: f.nombre ?? {},
      descripcion: f.descripcion ?? {},
      precioCop: f.precio_cop,
      imagenUrl: f.imagen_url,
      imagenes: extras.length ? extras : (f.imagen_url ? [f.imagen_url] : []),
      tallas: f.tallas ?? [],
      stock: f.stock ?? 0,
      destacado: !!f.destacado,
      activo: !!f.activo
    };
  }

  private aFila(p: ProductoNuevo) {
    return {
      categoria_id: p.categoriaId,
      slug: p.slug,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_cop: p.precioCop,
      imagen_url: p.imagenes[0] ?? null,
      imagenes: p.imagenes,
      tallas: p.tallas,
      stock: p.stock,
      destacado: p.destacado,
      activo: p.activo
    };
  }

  private traducir(error: { code?: string; message: string }): string {
    if (error.code === '23505') return 'Ya existe un producto con esa URL (slug).';
    if (error.code === '23503') return 'No se puede eliminar: el producto está en pedidos existentes.';
    return error.message;
  }
}