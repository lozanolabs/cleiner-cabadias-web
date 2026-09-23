import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly db = inject(Supabase).client;
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _sesion = signal<Session | null>(null);
  private readonly _listo = signal(false);

  readonly sesion = this._sesion.asReadonly();
  readonly listo = this._listo.asReadonly();
  readonly autenticado = computed(() => !!this._sesion());
  readonly correo = computed(() => this._sesion()?.user?.email ?? '');

  constructor() {
    if (!this.esNavegador) {
      this._listo.set(true);
      return;
    }

    this.db.auth.getSession().then(({ data }) => {
      this._sesion.set(data.session);
      this._listo.set(true);
    });

    this.db.auth.onAuthStateChange((_evento, sesion) => {
      this._sesion.set(sesion);
    });
  }

  async entrar(correo: string, clave: string): Promise<void> {
    const { error } = await this.db.auth.signInWithPassword({
      email: correo,
      password: clave
    });
    if (error) throw new Error(this.traducirError(error.message));
  }

  async salir(): Promise<void> {
    await this.db.auth.signOut();
    this._sesion.set(null);
  }

  private traducirError(mensaje: string): string {
    if (mensaje.includes('Invalid login credentials')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (mensaje.includes('Email not confirmed')) {
      return 'La cuenta no ha sido confirmada.';
    }
    return 'No se pudo iniciar sesión. Intenta de nuevo.';
  }
}