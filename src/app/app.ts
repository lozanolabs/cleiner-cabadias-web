import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { TPipe } from './core/i18n/t.pipe';
import { BotonWhatsapp } from './shared/ui/boton-whatsapp/boton-whatsapp';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, TPipe, BotonWhatsapp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly esPublico = computed(() => !this.url().startsWith('/admin'));
}