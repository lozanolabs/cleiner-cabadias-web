export interface TallaProducto {
  talla: string;
  /** Precio de ESTA talla. Puede diferir entre tallas del mismo producto. */
  precio: number;
  stock: number;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  imagenes: string[];

  /** Tallas del producto, ordenadas de menor a mayor. */
  tallas: TallaProducto[];

  categoriaSlug: string;
  categoriaNombre: string;

  /* ── Derivados de `tallas`, para el listado ── */
  precioDesde: number;
  precioHasta: number;
  stockTotal: number;
}

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
}

/** Medidas corporales de una talla. Son iguales para toda la tienda. */
export interface MedidaTalla {
  talla: string;
  orden: number;
  busto: number | null;
  cintura: number | null;
  cadera: number | null;
  contornoBrazo: number | null;
  anchoEspalda: number | null;
  largoBrazo: number | null;
}

/** La talla única no tiene medidas corporales; sirve para no pintar una fila vacía. */
export function tieneMedidas(m: MedidaTalla): boolean {
  return m.busto !== null || m.cintura !== null || m.cadera !== null
      || m.contornoBrazo !== null || m.anchoEspalda !== null || m.largoBrazo !== null;
}
export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
}