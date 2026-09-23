import { Routes } from '@angular/router';

export const catalogoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/listado/listado').then(m => m.Listado),
    title: 'Tienda | Cleiner Cabadias'
  },
  {
    // ANTES de ':categoria', o 'producto' se interpreta como categoría
    path: 'producto/:slug',
    loadComponent: () =>
      import('./pages/detalle-producto/detalle-producto').then(m => m.DetalleProducto)
  },
  {
    path: ':categoria',
    loadComponent: () => import('./pages/listado/listado').then(m => m.Listado)
  }
];