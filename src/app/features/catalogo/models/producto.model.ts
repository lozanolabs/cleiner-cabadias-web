export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;          // la principal, para la tarjeta
  imagenes: string[];         // galería completa, la principal de primera
  tallas: string[];
  categoriaSlug: string;
  categoriaNombre: string;    // ya traducido
}

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
}