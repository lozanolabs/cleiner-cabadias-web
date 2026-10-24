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

  /** Tarifa de envío, leída de la configuración de la tienda. */
  private readonly recursoEnvio = resource({
    loader: async () => {
      const { data } = await this.db
        .from('configuracion').select('valor').eq('clave', 'envio').maybeSingle();
      return {
        tarifa: Number(data?.valor?.tarifa_cop ?? 0),
        gratisDesde: data?.valor?.gratis_desde_cop ? Number(data.valor.gratis_desde_cop) : null
      };
    }
  });

  readonly tarifaEnvio = computed(() => this.recursoEnvio.value()?.tarifa ?? 0);
  readonly gratisDesde = computed(() => this.recursoEnvio.value()?.gratisDesde ?? null);

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