import {
  ChangeDetectionStrategy, Component, OnDestroy,
  computed, inject, input, signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../models/producto.model';
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

  readonly tallaElegida = signal<string | undefined>(undefined);
  readonly agregado = signal(false);

  readonly tallas = computed(() => this.producto().tallas ?? []);
  readonly necesitaTalla = computed(() => this.tallas().length > 0);

  readonly puedeAgregar = computed(() =>
    !this.necesitaTalla() || !!this.tallaElegida()
  );

  private temporizador?: ReturnType<typeof setTimeout>;

  elegirTalla(t: string): void {
    this.tallaElegida.update(actual => (actual === t ? undefined : t));
  }

  agregar(): void {
    if (!this.puedeAgregar()) return;

    this.carrito.agregar(this.producto(), 1, this.tallaElegida());
    this.agregado.set(true);
    this.tallaElegida.set(undefined);

    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.agregado.set(false), 2200);
  }

  ngOnDestroy(): void {
    clearTimeout(this.temporizador);
  }
}