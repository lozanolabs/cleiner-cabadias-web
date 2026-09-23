export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoriaSlug: string;
  tallas: string[]; 
}

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
}