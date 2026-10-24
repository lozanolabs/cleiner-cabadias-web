import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-boton-whatsapp',
  templateUrl: './boton-whatsapp.html',
  styleUrl: './boton-whatsapp.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BotonWhatsapp {
  /** Número en formato internacional, sin +, espacios ni guiones. Ej: 573001234567 */
  readonly numero = input.required<string>();

  /** Texto con el que arranca la conversación. Opcional. */
  readonly mensaje = input<string>('');

  /** Etiqueta accesible y tooltip. */
  readonly etiqueta = input<string>('WhatsApp');

  readonly enlace = computed(() => {
    const limpio = this.numero().replace(/\D/g, '');
    const texto = this.mensaje().trim();
    return texto
      ? `https://wa.me/${limpio}?text=${encodeURIComponent(texto)}`
      : `https://wa.me/${limpio}`;
  });
}