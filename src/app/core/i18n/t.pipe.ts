import { Pipe, PipeTransform, inject } from '@angular/core';
import { Idioma } from './idioma';
import { TEXTOS, ClaveTexto } from './textos';

@Pipe({ name: 't', pure: false })
export class TPipe implements PipeTransform {
  private readonly idioma = inject(Idioma);

  transform(clave: ClaveTexto): string {
    return TEXTOS[clave]?.[this.idioma.actual()] ?? TEXTOS[clave]?.es ?? clave;
  }
}