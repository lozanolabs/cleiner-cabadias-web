export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  imagenes: string[];
  tallas: string[];
  stock: number;              // ← nuevo
  categoriaSlug: string;
  categoriaNombre: string;
}

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
}