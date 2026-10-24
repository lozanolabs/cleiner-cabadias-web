import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TPipe } from '../../../../core/i18n/t.pipe';
import { Idioma } from '../../../../core/i18n/idioma';
import { Horario } from '../../../../layout/horario/horario';



const PALABRAS: Record<string, string[]> = {
  es: ['Identidad', 'Cultura', 'Diferencia', 'Historia'],
  en: ['Identity', 'Culture', 'Difference', 'History'],
  fr: ['Identité', 'Culture', 'Différence', 'Histoire'],
  it: ['Identità', 'Cultura', 'Differenza', 'Storia'],
  pt: ['Identidade', 'Cultura', 'Diferença', 'História']
};

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, TPipe, Horario],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Inicio implements OnDestroy {
  private readonly idioma = inject(Idioma);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  readonly palabra = signal('');
  private temporizador?: ReturnType<typeof setTimeout>;

  constructor() {
    if (!this.esNavegador) {
      this.palabra.set(PALABRAS[this.idioma.actual()][0]);
      return;
    }

    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido) {
      this.palabra.set(PALABRAS[this.idioma.actual()][0]);
      return;
    }

    this.escribir(0, 0, false);
  }

  private escribir(indice: number, letras: number, borrando: boolean): void {
    const lista = PALABRAS[this.idioma.actual()] ?? PALABRAS['es'];
    const completa = lista[indice % lista.length];

    this.palabra.set(completa.slice(0, letras));

    let espera = borrando ? 55 : 110;
    let siguienteIndice = indice;
    let siguientesLetras = letras;
    let siguienteBorrando = borrando;

    if (!borrando && letras === completa.length) {
      espera = 1800;
      siguienteBorrando = true;
    } else if (borrando && letras === 0) {
      siguienteBorrando = false;
      siguienteIndice = indice + 1;
      espera = 350;
    } else {
      siguientesLetras = borrando ? letras - 1 : letras + 1;
    }

    this.temporizador = setTimeout(
      () => this.escribir(siguienteIndice, siguientesLetras, siguienteBorrando),
      espera
    );
  }

  ngOnDestroy(): void {
    clearTimeout(this.temporizador);
  }
}