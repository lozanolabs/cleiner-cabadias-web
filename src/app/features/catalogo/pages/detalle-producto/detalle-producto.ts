import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Productos } from '../../services/productos';
import { Idioma } from '../../../../core/i18n/idioma';
import { CarritoStore } from '../../../carrito/services/carrito.store';
import { Precio } from '../../../../shared/ui/precio/precio';
import { TPipe } from '../../../../core/i18n/t.pipe';

@Component({
  selector: 'app-detalle-producto',
  imports: [RouterLink, Precio, TPipe],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleProducto {
  private readonly ruta = inject(ActivatedRoute);
  private readonly repo = inject(Productos);
  private readonly idioma = inject(Idioma);

  readonly carrito = inject(CarritoStore);

  private readonly slug = toSignal(
    this.ruta.paramMap.pipe(map(p => p.get('slug') ?? '')),
    { initialValue: '' }
  );

  private readonly recurso = resource({
    params: () => ({ slug: this.slug(), idioma: this.idioma.actual() }),
    loader: ({ params }) => this.repo.porSlug(params.slug)
  });

  readonly producto = computed(() => this.recurso.value());
  readonly cargando = computed(() => this.recurso.isLoading());
  readonly noEncontrado = computed(() => !this.recurso.isLoading() && this.recurso.value() === null);

  readonly tallaElegida = signal<string | undefined>(undefined);
  readonly cantidad = signal(1);
  readonly agregado = signal(false);

  /** Solo exige talla si el producto tiene tallas definidas. */
  readonly puedeAgregar = computed(() => {
    const p = this.producto();
    if (!p) return false;
    if (!p.tallas?.length) return true;
    return !!this.tallaElegida();
  });

  elegirTalla(t: string): void {
    this.tallaElegida.set(t);
  }

  cambiarCantidad(delta: number): void {
    this.cantidad.update(c => Math.max(1, c + delta));
  }

  agregar(): void {
    const p = this.producto();
    if (!p || !this.puedeAgregar()) return;

    this.carrito.agregar(p, this.cantidad(), this.tallaElegida());

    this.agregado.set(true);
    setTimeout(() => this.agregado.set(false), 2500);
  }
}