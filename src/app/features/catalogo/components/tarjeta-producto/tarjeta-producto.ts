import {
  ChangeDetectionStrategy, Component, OnDestroy,
  computed, inject, input, signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto, TallaProducto } from '../../models/producto.model';
import { CarritoStore } from '../../../carrito/services/carrito.store';
import { Precio } from '../../../../shared/ui/precio/precio';
import { TPipe } from '../../../../core/i18n/t.pipe';

@Component({
  selector: 'app-tarjeta-producto',
  imports: [RouterLink, Precio, TPipe],
  templateUrl: './tarjeta-producto.html',
  styleUrl: './tarjeta-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TarjetaProducto implements OnDestroy {
  private readonly carrito = inject(CarritoStore);

  readonly producto = input.required<Producto>();

  private readonly elegidaManual = signal<string | undefined>(undefined);
  readonly agregado = signal(false);

  readonly tallas = computed(() => this.producto().tallas ?? []);
  readonly agotado = computed(() => this.producto().stockTotal <= 0);

  /** Si solo hay una talla disponible, se elige sola: no hay nada que decidir. */
  readonly tallaElegida = computed<TallaProducto | undefined>(() => {
    const ts = this.tallas();
    const manual = this.elegidaManual();
    if (manual) return ts.find(t => t.talla === manual);

    const conStock = ts.filter(t => t.stock > 0);
    return conStock.length === 1 ? conStock[0] : undefined;
  });

  /** Con una sola talla elegida sola, mostrar los botones sobra. */
  readonly mostrarTallas = computed(() => this.tallas().length > 1);

  private readonly precioUnico = computed(() =>
    this.producto().precioDesde === this.producto().precioHasta
  );

  readonly precioMostrado = computed(() =>
    this.tallaElegida()?.precio ?? this.producto().precioDesde
  );

  /** "Desde $X" solo cuando los precios difieren y aún no se eligió talla. */
  readonly mostrarDesde = computed(() =>
    !this.precioUnico() && !this.tallaElegida()
  );

  readonly puedeAgregar = computed(() => {
    const t = this.tallaElegida();
    return !!t && t.stock > 0;
  });

  private temporizador?: ReturnType<typeof setTimeout>;

  elegirTalla(t: TallaProducto): void {
    if (t.stock <= 0) return;
    this.elegidaManual.update(actual => (actual === t.talla ? undefined : t.talla));
  }

  agregar(): void {
    const t = this.tallaElegida();
    if (!t) return;

    this.carrito.agregar(this.producto(), t, 1);
    this.agregado.set(true);
    this.elegidaManual.set(undefined);

    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.agregado.set(false), 2200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.temporizador);
  }
}