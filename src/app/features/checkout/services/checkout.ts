import { Injectable, inject, resource, computed } from '@angular/core';
import { Supabase } from '../../../core/supabase/supabase';

export interface ResumenPedido {
  referencia: string;
  pedidoId: string;
  subtotalCop: number;
  envioCop: number;
  totalCop: number;
  urlPago: string;
}

@Injectable({ providedIn: 'root' })
export class Checkout {
  private readonly db = inject(Supabase).client;

  /** Configuración de la tienda: tarifa de envío y si las ventas están abiertas. */
  private readonly recursoConfig = resource({
    loader: async () => {
      const { data } = await this.db
        .from('configuracion')
        .select('clave, valor')
        .in('clave', ['envio', 'ventas']);

      const mapa = new Map((data ?? []).map((r: any) => [r.clave, r.valor]));
      const envio: any = mapa.get('envio') ?? {};
      const ventas: any = mapa.get('ventas') ?? {};

      return {
        tarifa: Number(envio?.tarifa_cop ?? 0),
        gratisDesde: envio?.gratis_desde_cop ? Number(envio.gratis_desde_cop) : null,
        // Falla cerrado: solo el valor exacto true habilita las ventas.
        ventasHabilitadas: ventas?.habilitadas === true,
        mensajeCierre: typeof ventas?.mensaje === 'string' ? ventas.mensaje : null
      };
    }
  });

  readonly tarifaEnvio = computed(() => this.recursoConfig.value()?.tarifa ?? 0);
  readonly gratisDesde = computed(() => this.recursoConfig.value()?.gratisDesde ?? null);

  /** Mientras carga la configuración también devuelve false, a propósito. */
  readonly ventasHabilitadas = computed(() => this.recursoConfig.value()?.ventasHabilitadas ?? false);
  readonly mensajeCierre = computed(() => this.recursoConfig.value()?.mensajeCierre ?? null);

  envioPara(subtotal: number): number {
    const gratis = this.gratisDesde();
    if (gratis !== null && subtotal >= gratis) return 0;
    return this.tarifaEnvio();
  }

  async crearPedido(payload: unknown): Promise<ResumenPedido> {
    const res = await fetch('/.netlify/functions/crear-pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'No se pudo crear el pedido');
    return json as ResumenPedido;
  }
}