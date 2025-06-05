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
  
  
showProfileMenu = false;

usuario = {
  nombre: 'Chef Martínez',
  rol: 'Administrador',
  avatar: '../../../assets/avatar.avif'
};

toggleProfileMenu() {
  this.showProfileMenu = !this.showProfileMenu;
}

closeProfileMenu() {
  this.showProfileMenu = false;
}

logout() {
  this.authService.logout();
}

  cerrarSesion() {
    this.authService.logout();
  }
}
