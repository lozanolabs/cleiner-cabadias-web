import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoStore } from '../../services/carrito.store';
import { Checkout } from '../../../checkout/services/checkout';
import { Precio } from '../../../../shared/ui/precio/precio';
import { TPipe } from '../../../../core/i18n/t.pipe';

@Component({
  selector: 'app-mi-carrito',
  imports: [RouterLink, Precio, TPipe],
  templateUrl: './mi-carrito.html',
  styleUrl: './mi-carrito.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiCarrito {
  readonly carrito = inject(CarritoStore);
  private readonly checkout = inject(Checkout);

  readonly envio = computed(() => this.checkout.envioPara(this.carrito.subtotal()));
  readonly total = computed(() => this.carrito.subtotal() + this.envio());
}