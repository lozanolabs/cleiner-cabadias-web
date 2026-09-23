import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductos, ProductoAdmin } from '../../services/admin-productos';

@Component({
  selector: 'app-productos-lista',
  imports: [RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './productos-lista.html',
  styleUrl: './productos-lista.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosLista {
  private readonly repo = inject(AdminProductos);

  readonly busqueda = signal('');
  readonly aviso = signal('');
  readonly error = signal('');
  readonly porBorrar = signal<ProductoAdmin | null>(null);

  readonly recurso = resource({
    loader: () => this.repo.listar()
  });

  readonly productos = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const lista = this.recurso.value() ?? [];
    if (!texto) return lista;

    return lista.filter(p =>
      (p.nombre['es'] ?? '').toLowerCase().includes(texto) ||
      p.slug.toLowerCase().includes(texto)
    );
  });

  async alternar(p: ProductoAdmin): Promise<void> {
    try {
      await this.repo.alternarActivo(p.id, !p.activo);
      this.recurso.reload();
      this.aviso.set(p.activo ? 'Producto ocultado de la tienda.' : 'Producto publicado.');
      setTimeout(() => this.aviso.set(''), 3000);
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }

  async confirmarBorrado(): Promise<void> {
    const p = this.porBorrar();
    if (!p) return;

    try {
      await this.repo.eliminar(p.id);
      this.porBorrar.set(null);
      this.recurso.reload();
      this.aviso.set('Producto eliminado.');
      setTimeout(() => this.aviso.set(''), 3000);
    } catch (e) {
      this.porBorrar.set(null);
      this.error.set((e as Error).message);
    }
  }
}