import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Horario } from '../../../../layout/horario/horario';
import { ClaveTexto } from '../../../../core/i18n/textos';
import { TPipe } from '../../../../core/i18n/t.pipe';

interface Coleccion {
  etiqueta: ClaveTexto;
  titulo: ClaveTexto;
  descripcion: ClaveTexto;
  imagen: string;
  ruta: string;
}

interface Pilar {
  numero: string;
  titulo: ClaveTexto;
  descripcion: ClaveTexto;
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, TPipe, Horario],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Inicio {
  readonly colecciones: Coleccion[] = [
    { etiqueta: 'inicio.mujer',      titulo: 'inicio.mujer',      descripcion: 'inicio.mujerDesc',      imagen: 'assets/mujeres.png',   ruta: '/tienda' },
    { etiqueta: 'inicio.hombre',     titulo: 'inicio.hombre',     descripcion: 'inicio.hombreDesc',     imagen: 'assets/HOMBRES1.png',  ruta: '/tienda' },
    { etiqueta: 'inicio.accesorios', titulo: 'inicio.accesorios', descripcion: 'inicio.accesoriosDesc', imagen: 'assets/accesorios.jpg', ruta: '/tienda/accesorios' }
  ];

  readonly pilares: Pilar[] = [
    { numero: '01', titulo: 'inicio.pilar1', descripcion: 'inicio.pilar1Desc' },
    { numero: '02', titulo: 'inicio.pilar2', descripcion: 'inicio.pilar2Desc' },
    { numero: '03', titulo: 'inicio.pilar3', descripcion: 'inicio.pilar3Desc' },
    { numero: '04', titulo: 'inicio.pilar4', descripcion: 'inicio.pilar4Desc' }
  ];

  /** La cinta se repite para que el desplazamiento sea continuo. */
  readonly repeticionesTicker = [0, 1, 2, 3, 4, 5, 6, 7];
}