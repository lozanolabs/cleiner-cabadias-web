import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Informes as RepoInformes, Granularidad } from '../../services/informes';

type Rango = 'hoy' | '7d' | '30d' | 'mes' | 'anio' | 'personalizado';

function aIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-informes',
  imports: [FormsModule, CurrencyPipe, DecimalPipe, DatePipe],
  templateUrl: './informes.html',
  styleUrl: './informes.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Informes {
  private readonly repo = inject(RepoInformes);

  readonly rango = signal<Rango>('30d');
  readonly granularidad = signal<Granularidad>('day');
  readonly desdeManual = signal(aIso(new Date()));
  readonly hastaManual = signal(aIso(new Date()));

  readonly rangos: { valor: Rango; etiqueta: string; gran: Granularidad }[] = [
    { valor: 'hoy',  etiqueta: 'Hoy',            gran: 'day' },
    { valor: '7d',   etiqueta: 'Últimos 7 días', gran: 'day' },
    { valor: '30d',  etiqueta: 'Últimos 30 días', gran: 'day' },
    { valor: 'mes',  etiqueta: 'Este año por mes', gran: 'month' },
    { valor: 'anio', etiqueta: 'Todo por año',   gran: 'year' }
  ];

  readonly fechas = computed<{ desde: string; hasta: string }>(() => {
    const hoy = new Date();
    const hasta = aIso(hoy);

    switch (this.rango()) {
      case 'hoy':
        return { desde: hasta, hasta };
      case '7d': {
        const d = new Date(hoy); d.setDate(d.getDate() - 6);
        return { desde: aIso(d), hasta };
      }
      case '30d': {
        const d = new Date(hoy); d.setDate(d.getDate() - 29);
        return { desde: aIso(d), hasta };
      }
      case 'mes':
        return { desde: `${hoy.getFullYear()}-01-01`, hasta };
      case 'anio':
        return { desde: '2020-01-01', hasta };
      default:
        return { desde: this.desdeManual(), hasta: this.hastaManual() };
    }
  });

  private readonly datos = resource({
    params: () => ({ ...this.fechas(), gran: this.granularidad() }),
    loader: async ({ params }) => {
      const [resumen, serie, top, categorias] = await Promise.all([
        this.repo.resumen(params.desde, params.hasta),
        this.repo.serie(params.gran, params.desde, params.hasta),
        this.repo.top(params.desde, params.hasta),
        this.repo.porCategoria(params.desde, params.hasta)
      ]);
      return { resumen, serie, top, categorias };
    }
  });

  readonly cargando = computed(() => this.datos.isLoading());
  readonly error = computed(() => this.datos.error());
  readonly resumen = computed(() => this.datos.value()?.resumen);
  readonly serie = computed(() => this.datos.value()?.serie ?? []);
  readonly top = computed(() => this.datos.value()?.top ?? []);
  readonly categorias = computed(() => this.datos.value()?.categorias ?? []);

  readonly maximoSerie = computed(() =>
    Math.max(1, ...this.serie().map(p => p.totalCop))
  );

  elegirRango(r: Rango, gran: Granularidad): void {
    this.rango.set(r);
    this.granularidad.set(gran);
  }

  aplicarPersonalizado(): void {
    this.rango.set('personalizado');
  }

  exportarCsv(): void {
    const filas = [
      ['Periodo', 'Ordenes', 'Total COP', 'Ticket promedio'],
      ...this.serie().map(p => [p.periodo, p.ordenes, p.totalCop, p.ticketPromedio])
    ];
    const csv = filas.map(f => f.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ventas-${this.fechas().desde}-a-${this.fechas().hasta}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}