import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoStore } from '../../services/carrito.store';
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
}