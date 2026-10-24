import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarritoStore } from '../../../carrito/services/carrito.store';
import { Checkout } from '../../services/checkout';
import { Conversion } from '../../../../core/i18n/conversion';
import { Idioma } from '../../../../core/i18n/idioma';
import { Precio } from '../../../../shared/ui/precio/precio';
import { TPipe } from '../../../../core/i18n/t.pipe';

export const DEPARTAMENTOS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
  'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
  'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
  'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

export const CLAVE_REF_PAGO = 'cc_ref_pago';

interface Datos {
  email: string;
  tipoPersona: 'natural' | 'juridica';
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  pais: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  detalle: string;
  telefono: string;
  aceptaTerminos: boolean;
  aceptaDatos: boolean;
}

const VACIO: Datos = {
  email: '', tipoPersona: 'natural', tipoDocumento: 'CC', numeroDocumento: '',
  nombre: '', pais: 'CO', departamento: '', ciudad: '', direccion: '',
  detalle: '', telefono: '', aceptaTerminos: false, aceptaDatos: false
};

@Component({
  selector: 'app-pago',
  imports: [FormsModule, RouterLink, Precio, TPipe],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pago {
  private readonly checkout = inject(Checkout);
  private readonly conversion = inject(Conversion);
  private readonly idioma = inject(Idioma);

  readonly carrito = inject(CarritoStore);
  readonly departamentos = DEPARTAMENTOS;

  readonly datos = signal<Datos>({ ...VACIO });
  readonly enviando = signal(false);
  readonly error = signal('');

  readonly subtotal = computed(() => this.carrito.subtotal());
  readonly envio = computed(() => this.checkout.envioPara(this.subtotal()));
  readonly total = computed(() => this.subtotal() + this.envio());

  readonly esJuridica = computed(() => this.datos().tipoPersona === 'juridica');

  readonly puedePagar = computed(() => {
    const d = this.datos();
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim());

    return correoValido &&
      !!d.numeroDocumento.trim() &&
      !!d.nombre.trim() &&
      !!d.departamento &&
      !!d.ciudad.trim() &&
      !!d.direccion.trim() &&
      !!d.telefono.trim() &&
      d.aceptaTerminos &&
      d.aceptaDatos &&
      !this.carrito.vacio();
  });

  fijar<K extends keyof Datos>(campo: K, valor: Datos[K]): void {
    this.datos.update(d => ({ ...d, [campo]: valor }));
  }

  async pagar(): Promise<void> {
    if (!this.puedePagar() || this.enviando()) return;

    this.error.set('');
    this.enviando.set(true);

    try {
      const resumen = await this.checkout.crearPedido({
        items: this.carrito.items().map(i => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          talla: i.talla
        })),
        comprador: {
          ...this.datos(),
          idioma: this.idioma.actual(),
          monedaVista: this.conversion.moneda()?.codigo ?? null
        }
      });

      // Wompi devuelve su propio id, no nuestra referencia:
      // la guardamos para recuperarla al volver.
      try {
        sessionStorage.setItem(CLAVE_REF_PAGO, resumen.referencia);
      } catch { /* ventana privada */ }

      // El carrito NO se vacía aquí: si el comprador abandona en Wompi
      // y vuelve, debe encontrar su carrito intacto para reintentar.
      window.location.href = resumen.urlPago;

    } catch (e) {
      this.error.set((e as Error).message);
      this.enviando.set(false);
    }
  }
}