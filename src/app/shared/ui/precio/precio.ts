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
    :host { display: inline-flex; align-items: baseline; gap: .5rem; flex-wrap: wrap; }
    .precio { font-weight: 600; }
    .precio__aprox { font-size: .85em; opacity: .7; }
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