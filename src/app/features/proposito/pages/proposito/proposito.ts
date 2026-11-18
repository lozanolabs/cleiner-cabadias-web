import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClaveTexto } from '../../../../core/i18n/textos';
import { TPipe } from '../../../../core/i18n/t.pipe';

interface ItemCapitulo { num: string; titulo: ClaveTexto; desc: ClaveTexto; }

interface Capitulo {
  eyebrow: ClaveTexto;
  titulo: ClaveTexto;
  cuerpo: ClaveTexto;
  imagen: string;
  invertido: boolean;
  items: ItemCapitulo[];
}

@Component({
  selector: 'app-proposito',
  imports: [RouterLink, TPipe],
  templateUrl: './proposito.html',
  styleUrl: './proposito.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Proposito {
  readonly capitulos: Capitulo[] = [
    {
      eyebrow: 'prop.cap1Eyebrow', titulo: 'prop.cap1Titulo', cuerpo: 'prop.cap1Cuerpo',
      imagen: 'assets/banda-mola.jpg', invertido: false,
      items: [
        { num: '01', titulo: 'prop.cap1Item1', desc: 'prop.cap1Item1Desc' },
        { num: '02', titulo: 'prop.cap1Item2', desc: 'prop.cap1Item2Desc' },
        { num: '03', titulo: 'prop.cap1Item3', desc: 'prop.cap1Item3Desc' }
      ]
    },
    {
      eyebrow: 'prop.cap2Eyebrow', titulo: 'prop.cap2Titulo', cuerpo: 'prop.cap2Cuerpo',
      imagen: 'assets/coleccion-mujer.jpg', invertido: true,
      items: [
        { num: '01', titulo: 'prop.cap2Item1', desc: 'prop.cap2Item1Desc' },
        { num: '02', titulo: 'prop.cap2Item2', desc: 'prop.cap2Item2Desc' },
        { num: '03', titulo: 'prop.cap2Item3', desc: 'prop.cap2Item3Desc' }
      ]
    },
    {
      eyebrow: 'prop.cap3Eyebrow', titulo: 'prop.cap3Titulo', cuerpo: 'prop.cap3Cuerpo',
      imagen: 'assets/accesorios.jpg', invertido: false,
      items: [
        { num: '01', titulo: 'prop.cap3Item1', desc: 'prop.cap3Item1Desc' },
        { num: '02', titulo: 'prop.cap3Item2', desc: 'prop.cap3Item2Desc' },
        { num: '03', titulo: 'prop.cap3Item3', desc: 'prop.cap3Item3Desc' }
      ]
    }
  ];

  readonly metricas: { numero: string; label: ClaveTexto }[] = [
    { numero: '40+',  label: 'prop.metrica1' },
    { numero: '30',   label: 'prop.metrica2' },
    { numero: '100%', label: 'prop.metrica3' },
    { numero: '3',    label: 'prop.metrica4' }
  ];

  readonly hitos: { anio: string; titulo: ClaveTexto; desc: ClaveTexto }[] = [
    { anio: '1994', titulo: 'prop.hito1', desc: 'prop.hito1Desc' },
    { anio: '2005', titulo: 'prop.hito2', desc: 'prop.hito2Desc' },
    { anio: '2015', titulo: 'prop.hito3', desc: 'prop.hito3Desc' },
    { anio: '2020', titulo: 'prop.hito4', desc: 'prop.hito4Desc' },
    { anio: '2026', titulo: 'prop.hito5', desc: 'prop.hito5Desc' }
  ];
}