import { Injectable, computed, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ItemCarrito } from '../models/item-carrito.model';
import { Producto } from '../../catalogo/models/producto.model';

const CLAVE = 'cc_carrito_v1';

@Injectable({ providedIn: 'root' })
export class CarritoStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly esNavegador = isPlatformBrowser(this.platformId);

  private readonly _items = signal<ItemCarrito[]>(this.leerDeStorage());

  readonly items = this._items.asReadonly();

  readonly cantidad = computed(() =>
    this._items().reduce((acc, i) => acc + i.cantidad, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  );

  readonly vacio = computed(() => this._items().length === 0);

  constructor() {
    effect(() => {
      const items = this._items();
      if (this.esNavegador) {
        localStorage.setItem(CLAVE, JSON.stringify(items));
      }
    });
  }

  agregar(producto: Producto, cantidad = 1, talla?: string): void {
    this._items.update(items => {
      const idx = items.findIndex(i => i.productoId === producto.id && i.talla === talla);

      if (idx === -1) {
        return [...items, {
          productoId: producto.id,
          slug: producto.slug,
          nombre: producto.nombre,
          imagenUrl: producto.imagenUrl,
          precio: producto.precio,
          cantidad,
          talla
        }];
      }

      return items.map((item, i) =>
        i === idx ? { ...item, cantidad: item.cantidad + cantidad } : item
      );
    });
  }

  actualizarCantidad(productoId: string, cantidad: number, talla?: string): void {
    if (cantidad <= 0) {
      this.eliminar(productoId, talla);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.productoId === productoId && i.talla === talla ? { ...i, cantidad } : i
      )
    );
  }

  eliminar(productoId: string, talla?: string): void {
    this._items.update(items =>
      items.filter(i => !(i.productoId === productoId && i.talla === talla))
    );
  }

  vaciar(): void {
    this._items.set([]);
  }

  private leerDeStorage(): ItemCarrito[] {
    if (!this.esNavegador) return [];
    try {
      const crudo = localStorage.getItem(CLAVE);
      return crudo ? JSON.parse(crudo) as ItemCarrito[] : [];
    } catch {
      return [];
    }
  }
}