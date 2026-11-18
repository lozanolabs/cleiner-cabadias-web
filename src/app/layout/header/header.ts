import {
  ChangeDetectionStrategy, Component, HostListener, PLATFORM_ID,
  computed, effect, inject, resource, signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  readonly idioma = inject(Idioma);
  readonly carrito = inject(CarritoStore);

  readonly abierto = signal(false);
  readonly idiomaAbierto = signal(false);

  readonly contacto = {
    direccion: 'Quibdó, Chocó. Calle 16 #24 - 38, Barrio Jardín',
    telefono: '+57 320 652 3244',
    whatsapp: '573206523244'
  };

  /** Reemplaza por los perfiles reales del cliente. */
  readonly redes = {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/'
  };

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

  readonly mostrarCarrito = computed(() => {
    if (this.carrito.cantidad() > 0) return true;
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

    // El menú ocupa toda la pantalla: si el fondo sigue desplazándose,
    // al cerrarlo el visitante aparece en otro punto de la página.
    effect(() => {
      const abierto = this.abierto();
      if (!this.esNavegador) return;
      document.body.style.overflow = abierto ? 'hidden' : '';
    });
  }

  alternar(): void { this.abierto.update(v => !v); }
  cerrar(): void { this.abierto.set(false); }

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
  cerrarConEscape(): void {
    this.idiomaAbierto.set(false);
    this.abierto.set(false);
  }
}