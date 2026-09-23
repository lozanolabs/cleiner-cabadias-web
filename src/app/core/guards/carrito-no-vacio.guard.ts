// src/app/features/checkout/guards/carrito-no-vacio.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CarritoStore } from '../../features/carrito/services/carrito.store';

export const carritoNoVacioGuard: CanActivateFn = () => {
  const carrito = inject(CarritoStore);
  const router = inject(Router);

  return carrito.cantidad() > 0 ? true : router.parseUrl('/carrito');
};