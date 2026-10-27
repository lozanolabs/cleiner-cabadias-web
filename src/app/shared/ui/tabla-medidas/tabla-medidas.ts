import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Medidas } from '../../../features/catalogo/services/medidas';
import { MedidaTalla } from '../../../features/catalogo/models/producto.model';
import { ClaveTexto } from '../../../core/i18n/textos';
import { TPipe } from '../../../core/i18n/t.pipe';

interface FilaMedida {
  clave: ClaveTexto;
  valores: Record<string, number | null>;
}

@Component({
  selector: 'app-tabla-medidas',
  imports: [TPipe],
  templateUrl: './tabla-medidas.html',
  styleUrl: './tabla-medidas.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaMedidas {
  private readonly medidas = inject(Medidas);

  /** Tallas del producto. Solo se muestran estas. */
  readonly tallas = input.required<string[]>();

  /** Talla elegida por quien mira, para resaltar su columna. */
  readonly seleccionada = input<string | undefined>(undefined);

  readonly columnas = computed<MedidaTalla[]>(() => this.medidas.para(this.tallas()));

  private readonly CAMPOS: ReadonlyArray<[ClaveTexto, keyof MedidaTalla]> = [
    ['medidas.busto',         'busto'],
    ['medidas.cintura',       'cintura'],
    ['medidas.cadera',        'cadera'],
    ['medidas.contornoBrazo', 'contornoBrazo'],
    ['medidas.anchoEspalda',  'anchoEspalda'],
    ['medidas.largoBrazo',    'largoBrazo']
  ];

  readonly filas = computed<FilaMedida[]>(() => {
    const cols = this.columnas();
    if (!cols.length) return [];

    return this.CAMPOS
      .map(([clave, campo]) => ({
        clave,
        valores: Object.fromEntries(
          cols.map(c => [c.talla, c[campo] as number | null])
        )
      }))
      // Si ninguna talla tiene ese dato, la fila sobra.
      .filter(f => Object.values(f.valores).some(v => v !== null));
  });
}