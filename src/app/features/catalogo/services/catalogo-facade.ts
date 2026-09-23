// features/catalogo/services/catalogo-facade.ts
import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { Productos, PRODUCTOS_POR_PAGINA } from './productos';
import { Idioma } from '../../../core/i18n/idioma';

@Injectable({ providedIn: 'root' })
export class CatalogoFacade {
  private readonly repo = inject(Productos);
  private readonly idioma = inject(Idioma);

  readonly categoriaActiva = signal<string | undefined>(undefined);
  readonly pagina = signal(1);

  private readonly recurso = resource({
    params: () => ({
      categoria: this.categoriaActiva(),
      pagina: this.pagina(),
      idioma: this.idioma.actual()
    }),
    loader: ({ params }) => this.repo.listar(params.categoria, params.pagina)
  });

  readonly productos = computed(() => this.recurso.value()?.productos ?? []);
  readonly total = computed(() => this.recurso.value()?.total ?? 0);
  readonly cargando = computed(() => this.recurso.isLoading());
  readonly error = computed(() => this.recurso.error());
  readonly vacio = computed(() => !this.recurso.isLoading() && this.total() === 0);

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.total() / PRODUCTOS_POR_PAGINA))
  );

  readonly paginasVisibles = computed<(number | '…')[]>(() => {
    const total = this.totalPaginas();
    const actual = this.pagina();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const nums = new Set([1, total, actual, actual - 1, actual + 1]);
    const lista = [...nums].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);

    const salida: (number | '…')[] = [];
    lista.forEach((n, i) => {
      if (i > 0 && n - (lista[i - 1] as number) > 1) salida.push('…');
      salida.push(n);
    });
    return salida;
  });

  filtrarPor(slug?: string): void {
    if (slug === this.categoriaActiva()) return;
    this.categoriaActiva.set(slug);
    this.pagina.set(1);
  }

  irA(p: number): void {
    const destino = Math.min(Math.max(1, p), this.totalPaginas());
    if (destino === this.pagina()) return;

    this.pagina.set(destino);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}