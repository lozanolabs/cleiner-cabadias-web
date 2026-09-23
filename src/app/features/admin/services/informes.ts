import { Injectable, inject } from '@angular/core';
import { Supabase } from '../../../core/supabase/supabase';

export type Granularidad = 'day' | 'week' | 'month' | 'year';

export interface PuntoSerie { periodo: string; ordenes: number; totalCop: number; ticketPromedio: number; }
export interface Resumen    { ordenes: number; totalCop: number; ticketPromedio: number; unidades: number; }
export interface FilaTop    { nombre: string; unidades: number; totalCop: number; }
export interface FilaCat    { categoria: string; unidades: number; totalCop: number; }

@Injectable({ providedIn: 'root' })
export class Informes {
  private readonly db = inject(Supabase).client;

  async serie(granularidad: Granularidad, desde: string, hasta: string): Promise<PuntoSerie[]> {
    const { data, error } = await this.db.rpc('ventas_por_periodo', { granularidad, desde, hasta });
    if (error) throw new Error(error.message);
    return (data ?? []).map((f: any) => ({
      periodo: f.periodo,
      ordenes: Number(f.ordenes),
      totalCop: Number(f.total_cop),
      ticketPromedio: Number(f.ticket_promedio)
    }));
  }

  async resumen(desde: string, hasta: string): Promise<Resumen> {
    const { data, error } = await this.db.rpc('ventas_resumen', { desde, hasta });
    if (error) throw new Error(error.message);
    const f = data?.[0] ?? {};
    return {
      ordenes: Number(f.ordenes ?? 0),
      totalCop: Number(f.total_cop ?? 0),
      ticketPromedio: Number(f.ticket_promedio ?? 0),
      unidades: Number(f.unidades ?? 0)
    };
  }

  async top(desde: string, hasta: string, limite = 10): Promise<FilaTop[]> {
    const { data, error } = await this.db.rpc('productos_mas_vendidos', { desde, hasta, limite });
    if (error) throw new Error(error.message);
    return (data ?? []).map((f: any) => ({
      nombre: f.nombre,
      unidades: Number(f.unidades),
      totalCop: Number(f.total_cop)
    }));
  }

  async porCategoria(desde: string, hasta: string): Promise<FilaCat[]> {
    const { data, error } = await this.db.rpc('ventas_por_categoria', { desde, hasta });
    if (error) throw new Error(error.message);
    return (data ?? []).map((f: any) => ({
      categoria: f.categoria,
      unidades: Number(f.unidades),
      totalCop: Number(f.total_cop)
    }));
  }
}