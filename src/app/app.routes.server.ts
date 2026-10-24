import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // El panel vive detrás de autenticación: no tiene sentido renderizarlo en servidor.
  {
    path: 'admin/**',
    renderMode: RenderMode.Client
  },

  // Carrito y checkout dependen del navegador (localStorage, pasarela de pago).
  {
    path: 'carrito',
    renderMode: RenderMode.Client
  },
  {
    path: 'checkout/**',
    renderMode: RenderMode.Client
  },

  // Catálogo y fichas: renderizado en servidor en cada petición, para que
  // el contenido llegue indexable sin tener que conocer los slugs en el build.
  {
    path: 'tienda/**',
    renderMode: RenderMode.Server
  },

  // El resto sí se prerenderiza.
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];