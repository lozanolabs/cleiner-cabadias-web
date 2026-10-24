import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Productos } from '../../services/productos';
import { Idioma } from '../../../../core/i18n/idioma';
import { CarritoStore } from '../../../carrito/services/carrito.store';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';
import { Precio } from '../../../../shared/ui/precio/precio';
import { TPipe } from '../../../../core/i18n/t.pipe';

@Component({
  selector: 'app-detalle-producto',
  imports: [RouterLink, Precio, TPipe, TarjetaProducto],
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
  readonly noEncontrado = computed(() =>
    !this.recurso.isLoading() && this.recurso.value() === null
  );

  // ── Galería ──────────────────────────────
  readonly imagenElegida = signal<string | null>(null);

  readonly imagenActiva = computed(() => {
    const p = this.producto();
    const elegida = this.imagenElegida();
    if (elegida && p?.imagenes.includes(elegida)) return elegida;
    return p?.imagenes[0] ?? 'assets/placeholder.svg';
  });

  elegirImagen(url: string): void {
    this.imagenElegida.set(url);
  }

  // ── Relacionados ─────────────────────────
  private readonly recursoRelacionados = resource({
    params: () => {
      const p = this.producto();
      return { categoria: p?.categoriaSlug ?? '', id: p?.id ?? '', idioma: this.idioma.actual() };
    },
    loader: ({ params }) =>
      params.id ? this.repo.relacionados(params.categoria, params.id, 4) : Promise.resolve([])
  });

  readonly relacionados = computed(() => this.recursoRelacionados.value() ?? []);

  // ── Compra ───────────────────────────────
  readonly tallaElegida = signal<string | undefined>(undefined);
  readonly cantidad = signal(1);
  readonly agregado = signal(false);

  readonly agotado = computed(() => (this.producto()?.stock ?? 0) <= 0);

  readonly puedeAgregar = computed(() => {
    const p = this.producto();
    if (!p || this.agotado()) return false;
    if (!p.tallas?.length) return true;
    return !!this.tallaElegida();
  });

  elegirTalla(t: string): void {
    this.tallaElegida.set(t);
  }

  cambiarCantidad(delta: number): void {
    const maximo = this.producto()?.stock ?? 1;
    this.cantidad.update(c => Math.min(maximo, Math.max(1, c + delta)));
  }

  agregar(): void {
    const p = this.producto();
    if (!p || !this.puedeAgregar()) return;

    this.carrito.agregar(p, this.cantidad(), this.tallaElegida());

    this.agregado.set(true);
    setTimeout(() => this.agregado.set(false), 2500);
  }
}