import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TPipe } from '../../core/i18n/t.pipe';

@Component({
  selector: 'app-horario',
  imports: [TPipe],
  templateUrl: './horario.html',
  styleUrl: './horario.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Horario {
  readonly whatsapp = '573206523244';

  readonly franjas = [
    { clave: 'horario.semana',   valor: '09:00 AM - 06:00 PM', cerrado: false },
    { clave: 'horario.finDeSemana', valor: 'horario.cerrado',  cerrado: true },
    { clave: 'horario.festivos', valor: 'horario.cerrado',     cerrado: true }
  ] as const;
}