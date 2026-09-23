import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/auth/auth';

@Component({
  selector: 'app-entrar',
  imports: [FormsModule],
  templateUrl: './entrar.html',
  styleUrl: './entrar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Entrar {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly correo = signal('');
  readonly clave = signal('');
  readonly enviando = signal(false);
  readonly error = signal('');

  async enviar(): Promise<void> {
    if (this.enviando()) return;

    this.error.set('');
    this.enviando.set(true);

    try {
      await this.auth.entrar(this.correo().trim(), this.clave());
      await this.router.navigate(['/admin/productos']);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.enviando.set(false);
    }
  }
}