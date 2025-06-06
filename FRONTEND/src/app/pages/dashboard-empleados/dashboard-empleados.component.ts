import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-empleados',
  imports: [RouterModule],
  templateUrl: './dashboard-empleados.component.html',
  styleUrl: './dashboard-empleados.component.css'
})
export class DashboardEmpleadosComponent {
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

