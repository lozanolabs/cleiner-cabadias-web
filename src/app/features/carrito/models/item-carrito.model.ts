export interface ItemCarrito {
  productoId: string;
  slug: string;
  nombre: string;
  imagenUrl: string;
  precio: number;      // en pesos, entero — nunca decimales
  cantidad: number;
  talla?: string;
}