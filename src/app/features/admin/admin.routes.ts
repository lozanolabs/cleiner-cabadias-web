import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'entrar',
    loadComponent: () => import('./pages/entrar/entrar').then(m => m.Entrar),
    title: 'Ingresar | Administración'
  },
  {
    path: '',
    loadComponent: () => import('./layout/panel/panel').then(m => m.Panel),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      {
        path: 'productos',
        loadComponent: () => import('./pages/productos-lista/productos-lista').then(m => m.ProductosLista),
        title: 'Productos | Administración'
      },
      {
        path: 'productos/nuevo',
        loadComponent: () => import('./pages/producto-form/producto-form').then(m => m.ProductoForm),
        title: 'Nuevo producto | Administración'
      },
      {
        path: 'productos/:id',
        loadComponent: () => import('./pages/producto-form/producto-form').then(m => m.ProductoForm),
        title: 'Editar producto | Administración'
      },
      {
        path: 'informes',
        loadComponent: () => import('./pages/informes/informes').then(m => m.Informes),
        title: 'Informes de ventas | Administración'
      }
    ]
  }
];