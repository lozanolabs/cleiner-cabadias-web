import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { Auth } from '../auth/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Espera a que Supabase termine de restaurar la sesión antes de decidir.
  return toObservable(auth.listo).pipe(
    filter(listo => listo),
    take(1),
    map(() => auth.autenticado() ? true : router.parseUrl('/admin/entrar'))
  );
};