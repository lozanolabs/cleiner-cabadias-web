import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Conversion } from '../../../core/i18n/conversion';
import { MONEDA_BASE } from '../../../core/i18n/moneda';

@Component({
  selector: 'app-precio',
  imports: [CurrencyPipe],
  template: `
    <span class="precio">
      {{ cop() | currency:base.codigo:'symbol-narrow':base.decimales:base.locale }}
    </span>

    @if (convertido(); as valor) {
      @if (moneda(); as m) {
        <span class="precio__aprox"
              title="Valor de referencia. El cobro se realiza en pesos colombianos.">
          ≈ {{ valor | currency:m.codigo:'symbol-narrow':m.decimales:m.locale }}
        </span>
      }
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: baseline;
      flex-wrap: wrap;
      column-gap: .5rem;
      row-gap: 2px;
    }

    /* Hereda de quien lo usa, para que la tarjeta pueda ponerlo en Anton. */
    .precio { font-weight: 600; }

    /*
     * El aproximado nunca hereda: es un dato secundario y debe verse igual
     * en la tarjeta, el detalle, el carrito y el checkout.
     */
    .precio__aprox {
      font-family: var(--fuente-texto);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 1.3;
      color: var(--tinta-tenue);
      opacity: 1;
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Precio {
  private readonly conversion = inject(Conversion);

  readonly cop = input.required<number>();
  readonly base = MONEDA_BASE;

  readonly moneda = computed(() => this.conversion.moneda());
  readonly convertido = computed(() => this.conversion.convertir(this.cop()));
}