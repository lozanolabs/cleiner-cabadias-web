import { ChangeDetectionStrategy, Component, HostListener, computed, inject, resource, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Idioma, CodigoIdioma } from '../../core/i18n/idioma';
import { TPipe } from '../../core/i18n/t.pipe';
import { Categorias } from '../../features/catalogo/services/categorias';
import { CarritoStore } from '../../features/carrito/services/carrito.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private readonly repoCategorias = inject(Categorias);
  private readonly router = inject(Router);

  readonly idioma = inject(Idioma);
  readonly carrito = inject(CarritoStore);

  readonly abierto = signal(false);
  readonly idiomaAbierto = signal(false);

  private readonly recurso = resource({
    params: () => ({ idioma: this.idioma.actual() }),
    loader: () => this.repoCategorias.listar()
  });
  readonly categorias = computed(() => this.recurso.value() ?? []);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  /** El carrito solo se muestra mientras el visitante está comprando. */
  readonly mostrarCarrito = computed(() => {
    const u = this.url();
    return u.startsWith('/tienda') || u.startsWith('/carrito') || u.startsWith('/checkout');
  });

  readonly idiomaActivo = computed(() =>
    this.idioma.disponibles.find(i => i.codigo === this.idioma.actual())!
  );

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.abierto.set(false);
        this.idiomaAbierto.set(false);
      });
  }

  alternar(): void { this.abierto.update(v => !v); }

  alternarIdioma(): void { this.idiomaAbierto.update(v => !v); }

  cambiarIdioma(codigo: string): void {
    this.idioma.cambiar(codigo as CodigoIdioma);
    this.idiomaAbierto.set(false);
  }

  @HostListener('document:click', ['$event'])
  cerrarFuera(e: MouseEvent): void {
    const dentro = (e.target as HTMLElement).closest('.idioma');
    if (!dentro) this.idiomaAbierto.set(false);
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void { this.idiomaAbierto.set(false); }
}