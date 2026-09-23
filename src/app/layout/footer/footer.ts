import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Idioma } from '../../core/i18n/idioma';
import { TPipe } from '../../core/i18n/t.pipe';
import { Categorias } from '../../features/catalogo/services/categorias';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  private readonly repoCategorias = inject(Categorias);
  private readonly idioma = inject(Idioma);

  private readonly recurso = resource({
    params: () => ({ idioma: this.idioma.actual() }),
    loader: () => this.repoCategorias.listar()
  });

  readonly categorias = computed(() => this.recurso.value() ?? []);
  readonly anio = new Date().getFullYear();

  readonly direccion = 'Quibdó, Chocó. Calle 16 #24 - 38 "Barrio Jardín"';
  readonly correo = 'compras@cleinercabadias.com';
  readonly telefono = '+57 320 652 3244';
  readonly whatsapp = '573206523244';
  readonly instagram = 'https://instagram.com/cleinercabadias';
  readonly facebook = 'https://facebook.com/cleinercabadias';
}