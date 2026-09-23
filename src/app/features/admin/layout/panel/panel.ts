import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../../../core/auth/auth';

@Component({
  selector: 'app-panel',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Panel {
  private readonly router = inject(Router);
  readonly auth = inject(Auth);

  async salir(): Promise<void> {
    await this.auth.salir();
    await this.router.navigate(['/admin/entrar']);
  }
}