import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Supabase } from '../../../../core/supabase/supabase';
import { CarritoStore } from '../../../carrito/services/carrito.store';
import { CLAVE_REF_PAGO } from '../pago/pago';
import { Precio } from '../../../../shared/ui/precio/precio';
import { TPipe } from '../../../../core/i18n/t.pipe';

type Resultado = 'aprobado' | 'rechazado' | 'pendiente' | 'desconocido';

@Component({
  selector: 'app-respuesta-pago',
  imports: [RouterLink, Precio, TPipe],
  templateUrl: './respuesta-pago.html',
  styleUrl: './respuesta-pago.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RespuestaPago {
  private readonly db = inject(Supabase).client;
  private readonly ruta = inject(ActivatedRoute);
  private readonly carrito = inject(CarritoStore);

  private readonly refUrl = toSignal(
    this.ruta.queryParamMap.pipe(map(p => p.get('ref') ?? '')),
    { initialValue: '' }
  );

  /** Wompi no devuelve nuestra referencia: la recuperamos de la sesión. */
  private readonly referencia = computed(() => {
    const deUrl = this.refUrl();
    if (deUrl) return deUrl;
    try {
      return sessionStorage.getItem(CLAVE_REF_PAGO) ?? '';
    } catch {
      return '';
    }
  });

  /**
   * El estado se lee de nuestra base, no de los parámetros de la URL:
   * esos los puede modificar cualquiera. La verdad la escribe el webhook.
   */
  private readonly recurso = resource({
    params: () => ({ ref: this.referencia() }),
    loader: async ({ params }) => {
      if (!params.ref) return null;

      const consultar = async () => {
        const { data } = await this.db
          .from('pedidos')
          .select('referencia, estado, total_cop, comprador_email')
          .eq('referencia', params.ref)
          .maybeSingle();
        return data;
      };

      // El webhook puede tardar unos segundos en llegar.
      for (let intento = 0; intento < 6; intento++) {
        const pedido = await consultar();

        if (pedido && pedido.estado !== 'pendiente_pago') {
          if (pedido.estado === 'pagado') {
            this.carrito.vaciar();
            try { sessionStorage.removeItem(CLAVE_REF_PAGO); } catch { /* vacío */ }
          }
          return pedido;
        }
        if (intento < 5) await new Promise(r => setTimeout(r, 2000));
      }

      return await consultar();
    }
  });

  readonly cargando = computed(() => this.recurso.isLoading());
  readonly pedido = computed(() => this.recurso.value());

  readonly resultado = computed<Resultado>(() => {
    const p = this.pedido();
    if (!p) return 'desconocido';
    if (p.estado === 'pagado') return 'aprobado';
    if (p.estado === 'cancelado') return 'rechazado';
    return 'pendiente';
  });
}