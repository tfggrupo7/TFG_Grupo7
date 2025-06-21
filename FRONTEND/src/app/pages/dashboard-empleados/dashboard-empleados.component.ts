import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../core/services/empleados.service';


@Component({
  selector: 'app-dashboard-empleados',
  imports: [RouterModule],
  templateUrl: './dashboard-empleados.component.html',
  styleUrl: './dashboard-empleados.component.css'
})
export class DashboardEmpleadosComponent {
authService = inject(AuthService);
router = inject(Router);
empleadosService = inject(EmpleadosService);


  // Propiedad para controlar la visibilidad del menú de perfil
  
showProfileMenu = false;
currentEmpleado: any = null;

usuario = {
  avatar: '../../../assets/avatar.avif'
};
ngOnInit() {
    this.loadCurrentEmpleado();
  }

toggleProfileMenu() {
  this.showProfileMenu = !this.showProfileMenu;
}

closeProfileMenu() {
  this.showProfileMenu = false;
}

async loadCurrentEmpleado() {
  try {
    this.currentEmpleado = await this.empleadosService.getCurrentUser();
     } catch (error: any) {
    
    
    // Manejar el error específico
    if (error.status === 404) {
          
      this.router.navigate(['/login']);
    }
  }
}

logout() {
  this.authService.logout();
  this.router.navigate(['/']);
}

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

