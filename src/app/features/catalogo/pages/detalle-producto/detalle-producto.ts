import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Productos } from '../../services/productos';
import { Idioma } from '../../../../core/i18n/idioma';
import { CarritoStore } from '../../../carrito/services/carrito.store';
import { TallaProducto } from '../../models/producto.model';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';
import { TablaMedidas } from '../../../../shared/ui/tabla-medidas/tabla-medidas';
import { Precio } from '../../../../shared/ui/precio/precio';
import { TPipe } from '../../../../core/i18n/t.pipe';

@Component({
  selector: 'app-detalle-producto',
  imports: [RouterLink, Precio, TPipe, TarjetaProducto, TablaMedidas],
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

  /* ── Galería ─────────────────────────────── */
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

  /* ── Relacionados ────────────────────────── */
  private readonly recursoRelacionados = resource({
    params: () => {
      const p = this.producto();
      return { categoria: p?.categoriaSlug ?? '', id: p?.id ?? '', idioma: this.idioma.actual() };
    },
    loader: ({ params }) =>
      params.id ? this.repo.relacionados(params.categoria, params.id, 4) : Promise.resolve([])
  });

  readonly relacionados = computed(() => this.recursoRelacionados.value() ?? []);

  /* ── Tallas ──────────────────────────────── */
  private readonly elegidaManual = signal<string | undefined>(undefined);

  readonly tallas = computed<TallaProducto[]>(() => this.producto()?.tallas ?? []);
  readonly nombresTallas = computed(() => this.tallas().map(t => t.talla));
  readonly agotado = computed(() => (this.producto()?.stockTotal ?? 0) <= 0);

  /** Con una sola talla disponible se elige sola. */
  readonly tallaElegida = computed<TallaProducto | undefined>(() => {
    const ts = this.tallas();
    const manual = this.elegidaManual();
    if (manual) return ts.find(t => t.talla === manual);

    const conStock = ts.filter(t => t.stock > 0);
    return conStock.length === 1 ? conStock[0] : undefined;
  });

  readonly nombreTallaElegida = computed(() => this.tallaElegida()?.talla);
  readonly mostrarTallas = computed(() => this.tallas().length > 1);

  private readonly precioUnico = computed(() => {
    const p = this.producto();
    return !p || p.precioDesde === p.precioHasta;
  });

  /** Precios distintos por talla: conviene verlos en cada botón. */
  readonly mostrarPrecioEnTalla = computed(() => !this.precioUnico());

  readonly precioMostrado = computed(() =>
    this.tallaElegida()?.precio ?? this.producto()?.precioDesde ?? 0
  );

  readonly mostrarDesde = computed(() => !this.precioUnico() && !this.tallaElegida());

  /* ── Compra ──────────────────────────────── */
  readonly cantidad = signal(1);

  readonly maximo = computed(() => this.tallaElegida()?.stock ?? 1);

  readonly puedeAgregar = computed(() => {
    const t = this.tallaElegida();
    return !!t && t.stock > 0;
  });

  /** Aviso de escasez: siempre referido a la talla elegida, no al total. */
  readonly pocasUnidades = computed(() => {
    const t = this.tallaElegida();
    return t && t.stock > 0 && t.stock <= 3 ? t.stock : null;
  });

  readonly agregado = signal(false);

  elegirTalla(t: TallaProducto): void {
    if (t.stock <= 0) return;
    this.elegidaManual.set(t.talla);
    this.cantidad.set(1);   // la talla anterior podía permitir más unidades
  }

  cambiarCantidad(delta: number): void {
    const tope = this.maximo();
    this.cantidad.update(c => Math.min(tope, Math.max(1, c + delta)));
  }

  agregar(): void {
    const p = this.producto();
    const t = this.tallaElegida();
    if (!p || !t) return;

    this.carrito.agregar(p, t, this.cantidad());

    this.agregado.set(true);
    setTimeout(() => this.agregado.set(false), 2500);
  }
}