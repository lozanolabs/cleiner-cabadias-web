import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClaveTexto } from '../../core/i18n/textos';
import { TPipe } from '../../core/i18n/t.pipe';

interface FilaHorario {
  dia: ClaveTexto;
  /** Horas literales, o una clave cuando está cerrado. */
  hora?: string;
  claveHora?: ClaveTexto;
}

@Component({
  selector: 'app-horario',
  imports: [TPipe],
  templateUrl: './horario.html',
  styleUrl: './horario.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Horario {
  readonly direccion = 'Quibdó, Chocó. Calle 16 #24 - 38, Barrio Jardín.';
  readonly whatsapp = '573206523244';

  readonly filas: FilaHorario[] = [
    { dia: 'horario.semana',      hora: '09:00 AM - 06:00 PM' },
    { dia: 'horario.finDeSemana', claveHora: 'horario.cerrado' },
    { dia: 'horario.festivos',    claveHora: 'horario.cerrado' }
  ];
}