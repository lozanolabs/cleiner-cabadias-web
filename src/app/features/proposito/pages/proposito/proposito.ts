import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TPipe } from '../../../../core/i18n/t.pipe';
import { Idioma, IDIOMA_POR_DEFECTO } from '../../../../core/i18n/idioma';
import { HITOS, CIFRAS_ACTUALES, CIERRE, Multi } from '../../datos/hitos';

@Component({
  selector: 'app-proposito',
  imports: [TPipe, NgTemplateOutlet],
  templateUrl: './proposito.html',
  styleUrl: './proposito.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Proposito {
  private readonly idioma = inject(Idioma);

  readonly hitos = HITOS;
  readonly actuales = CIFRAS_ACTUALES;
  readonly cierre = CIERRE;

  /** Devuelve el texto en el idioma activo, con respaldo al español. */
  txt(m?: Multi): string {
    if (!m) return '';
    return m[this.idioma.actual()] ?? m[IDIOMA_POR_DEFECTO];
  }
}