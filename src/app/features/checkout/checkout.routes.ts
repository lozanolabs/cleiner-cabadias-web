import { Routes } from '@angular/router';
import { carritoNoVacioGuard } from '../../core/guards/carrito-no-vacio.guard';

export const checkoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/pago/pago').then(m => m.Pago),
    canActivate: [carritoNoVacioGuard],
    title: 'Finalizar compra | Cleiner Cabadias'
  },
  {
    path: 'respuesta',
    loadComponent: () =>
      import('./pages/respuesta-pago/respuesta-pago').then(m => m.RespuestaPago),
    title: 'Resultado del pago | Cleiner Cabadias'
  }
];