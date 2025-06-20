import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-empleados',
  imports: [RouterModule],
  templateUrl: './dashboard-empleados.component.html',
  styleUrl: './dashboard-empleados.component.css'
})
export class DashboardEmpleadosComponent {
authService = inject(AuthService);
router = inject(Router);
rol: string = ''

  // Propiedad para controlar la visibilidad del menú de perfil
  
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
  this.router.navigate(['/']);
}

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(){
    console.log("pasa por aqui")
    this.rol = this.authService.getRolEmpleado()
    console.log("pasa por aqui rol: ", this.rol)
  }
}

