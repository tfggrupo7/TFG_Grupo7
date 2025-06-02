import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  authService = inject(AuthService);

  cerrarSesion() {
    this.authService.logout();
  }
}
