import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AdminProductos, ProductoNuevo, TextoMultiidioma } from '../../services/admin-productos';
import { AdminCategorias } from '../../services/admin-categorias';
import { IDIOMAS, CodigoIdioma } from '../../../../core/i18n/idioma';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductoForm {
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly repo = inject(AdminProductos);
  private readonly repoCategorias = inject(AdminCategorias);

  readonly idiomas = IDIOMAS;

  readonly id = toSignal(this.ruta.paramMap.pipe(map(p => p.get('id'))), { initialValue: null });
  readonly editando = computed(() => !!this.id());

  // ── Campos ──────────────────────────────
  readonly categoriaId = signal('');
  readonly slug = signal('');
  readonly nombre = signal<TextoMultiidioma>({});
  readonly descripcion = signal<TextoMultiidioma>({});
  readonly precioCop = signal<number | null>(null);
  readonly imagenUrl = signal<string | null>(null);
  readonly tallasTexto = signal('');
  readonly stock = signal(0);
  readonly destacado = signal(false);
  readonly activo = signal(true);

  readonly idiomaAbierto = signal<CodigoIdioma>('es');
  readonly guardando = signal(false);
  readonly subiendo = signal(false);
  readonly error = signal('');

  private readonly recursoCategorias = resource({ loader: () => this.repoCategorias.listar() });
  readonly categorias = computed(() => this.recursoCategorias.value() ?? []);

  private readonly recursoProducto = resource({
    params: () => ({ id: this.id() }),
    loader: async ({ params }) => {
      if (!params.id) return null;
      const p = await this.repo.porId(params.id);
      if (p) {
        this.categoriaId.set(p.categoriaId);
        this.slug.set(p.slug);
        this.nombre.set({ ...p.nombre });
        this.descripcion.set({ ...p.descripcion });
        this.precioCop.set(p.precioCop);
        this.imagenUrl.set(p.imagenUrl);
        this.tallasTexto.set(p.tallas.join(', '));
        this.stock.set(p.stock);
        this.destacado.set(p.destacado);
        this.activo.set(p.activo);
      }
      return p;
    }
  });

  readonly cargando = computed(() => this.recursoProducto.isLoading());

  /** Idiomas que todavía no tienen el nombre traducido. */
  readonly faltantes = computed(() =>
    this.idiomas.filter(i => !this.nombre()[i.codigo]?.trim()).map(i => i.nombre)
  );

  readonly puedeGuardar = computed(() =>
    !!this.categoriaId() &&
    !!this.slug().trim() &&
    !!this.nombre()['es']?.trim() &&
    (this.precioCop() ?? 0) > 0
  );

  // ── Acciones ────────────────────────────
  fijarTexto(campo: 'nombre' | 'descripcion', idioma: CodigoIdioma, valor: string): void {
    const signalDestino = campo === 'nombre' ? this.nombre : this.descripcion;
    signalDestino.update(actual => ({ ...actual, [idioma]: valor }));
  }

  generarSlug(): void {
    const base = (this.nombre()['es'] ?? '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    if (base) this.slug.set(base);
  }

  async subirImagen(evento: Event): Promise<void> {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
      this.error.set('La imagen supera los 5 MB. Comprímela antes de subirla.');
      return;
    }

    this.error.set('');
    this.subiendo.set(true);
    try {
      const url = await this.repo.subirImagen(archivo, this.slug() || 'producto');
      this.imagenUrl.set(url);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.subiendo.set(false);
    }
  }

  async guardar(): Promise<void> {
    if (!this.puedeGuardar() || this.guardando()) return;

    this.error.set('');
    this.guardando.set(true);

    const datos: ProductoNuevo = {
      categoriaId: this.categoriaId(),
      slug: this.slug().trim(),
      nombre: this.limpiar(this.nombre()),
      descripcion: this.limpiar(this.descripcion()),
      precioCop: Math.round(this.precioCop() ?? 0),
      imagenUrl: this.imagenUrl(),
      tallas: this.tallasTexto().split(',').map(t => t.trim()).filter(Boolean),
      stock: Math.max(0, Math.round(this.stock())),
      destacado: this.destacado(),
      activo: this.activo()
    };

    try {
      const id = this.id();
      if (id) {
        await this.repo.actualizar(id, datos);
      } else {
        await this.repo.crear(datos);
      }
      await this.router.navigate(['/admin/productos']);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.guardando.set(false);
    }
  }

  private limpiar(t: TextoMultiidioma): TextoMultiidioma {
    return Object.fromEntries(
      Object.entries(t).filter(([, v]) => v?.trim()).map(([k, v]) => [k, v!.trim()])
    );
  }
}