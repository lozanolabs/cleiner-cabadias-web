import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/inicio/pages/inicio/inicio').then(m => m.Inicio),
    title: 'Cleiner Cabadias | Moda con propósito'
  },
  {
    path: 'tienda',
    loadChildren: () =>
        import('./features/catalogo/catalogo.routes').then(m => m.catalogoRoutes)
  },
  {
    path: 'por-que-lo-hacemos',
    loadComponent: () =>
      import('./features/proposito/pages/proposito/proposito').then(m => m.Proposito),
    title: '¿Por qué lo hacemos? | Cleiner Cabadias'
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./features/carrito/pages/mi-carrito/mi-carrito').then(m => m.MiCarrito),
    title: 'Mi carrito | Cleiner Cabadias'
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/checkout.routes').then(m => m.checkoutRoutes)
  },
    {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/ui/no-encontrado/no-encontrado').then(m => m.NoEncontrado),
    title: 'Página no encontrada'
  }
];