import { ChangeDetectionStrategy, Component, computed, effect, inject, resource } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CatalogoFacade } from '../../services/catalogo-facade';
import { Categorias } from '../../services/categorias';
import { Idioma } from '../../../../core/i18n/idioma';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';
import { TPipe } from '../../../../core/i18n/t.pipe';

@Component({
  selector: 'app-listado',
  imports: [RouterLink, RouterLinkActive, TarjetaProducto, TPipe],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Listado {
  private readonly ruta = inject(ActivatedRoute);
  private readonly repoCategorias = inject(Categorias);
  private readonly idioma = inject(Idioma);

  readonly catalogo = inject(CatalogoFacade);

  private readonly categoriaUrl = toSignal(
    this.ruta.paramMap.pipe(map(p => p.get('categoria') ?? undefined))
  );

  /** Las mismas categorías del encabezado: los filtros salen de aquí. */
  private readonly recurso = resource({
    params: () => ({ idioma: this.idioma.actual() }),
    loader: () => this.repoCategorias.listar()
  });
  readonly categorias = computed(() => this.recurso.value() ?? []);

  /**
   * El nombre traducido de la categoría, no el slug con guiones cambiados
   * por espacios: "linea-etnica" no es un título.
   */
  readonly categoriaActual = computed(() => {
    const slug = this.categoriaUrl();
    return slug ? this.categorias().find(c => c.slug === slug) : undefined;
  });

  readonly enCategoria = computed(() => !!this.categoriaUrl());

  constructor() {
    effect(() => this.catalogo.filtrarPor(this.categoriaUrl()));
  }
}