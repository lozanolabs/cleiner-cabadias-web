import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { Precio } from '../../../../shared/ui/precio/precio';
@Component({
  selector: 'app-tarjeta-producto',
  imports: [RouterLink, Precio],
  templateUrl: './tarjeta-producto.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TarjetaProducto {
  readonly producto = input.required<Producto>();
}