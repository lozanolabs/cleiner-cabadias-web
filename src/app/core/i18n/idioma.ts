import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const IDIOMAS = [
  { codigo: 'es', nombre: 'Español',    bandera: 'co' },
  { codigo: 'en', nombre: 'English',    bandera: 'us' },
  { codigo: 'fr', nombre: 'Français',   bandera: 'fr' },
  { codigo: 'it', nombre: 'Italiano',   bandera: 'it' },
  { codigo: 'pt', nombre: 'Português',  bandera: 'pt' }
] as const;

export type CodigoIdioma = typeof IDIOMAS[number]['codigo'];

export const IDIOMA_POR_DEFECTO: CodigoIdioma = 'es';

const CLAVE = 'cc_idioma';

@Injectable({ providedIn: 'root' })
export class Idioma {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly esNavegador = isPlatformBrowser(this.platformId);

  readonly actual = signal<CodigoIdioma>(this.detectar());
  readonly disponibles = IDIOMAS;

  constructor() {
    effect(() => {
      const codigo = this.actual();
      if (this.esNavegador) {
        localStorage.setItem(CLAVE, codigo);
        document.documentElement.lang = codigo;
      }
    });
  }

  cambiar(codigo: CodigoIdioma): void {
    this.actual.set(codigo);
  }

  private detectar(): CodigoIdioma {
    if (!this.esNavegador) return IDIOMA_POR_DEFECTO;

    const guardado = localStorage.getItem(CLAVE) as CodigoIdioma | null;
    if (guardado && IDIOMAS.some(i => i.codigo === guardado)) return guardado;

    const delNavegador = navigator.language.slice(0, 2) as CodigoIdioma;
    return IDIOMAS.some(i => i.codigo === delNavegador) ? delNavegador : IDIOMA_POR_DEFECTO;
  }
}