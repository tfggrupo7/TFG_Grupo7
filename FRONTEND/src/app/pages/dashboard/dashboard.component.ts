import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { IUsuario } from '../../interfaces/iusuario.interfaces';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  authService = inject(AuthService);
  router = inject(Router);
  @Input() usuario!: IUsuario;
  
  
showProfileMenu = false;
isMobile = window.innerWidth <= 768;

avatar = {
  rol: "Administrador",
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
}
