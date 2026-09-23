import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CatalogoFacade } from '../../services/catalogo-facade';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';
import { TPipe } from '../../../../core/i18n/t.pipe';

@Component({
  selector: 'app-listado',
  imports: [RouterLink, TarjetaProducto, TPipe],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Listado {
  private readonly ruta = inject(ActivatedRoute);
  readonly catalogo = inject(CatalogoFacade);

  private readonly categoriaUrl = toSignal(
    this.ruta.paramMap.pipe(map(p => p.get('categoria') ?? undefined))
  );

  readonly tituloCategoria = computed(() => {
  const slug = this.categoriaUrl();
  if (!slug) return 'Tienda';
  return slug.replace(/-/g, ' ');
});

  constructor() {
    effect(() => this.catalogo.filtrarPor(this.categoriaUrl()));
  }
}