import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { IUsuario } from '../../interfaces/iusuario.interfaces';
import { UsuarioService } from '../../core/services/usuario.service';




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
  
  router = inject(Router);
  @Input() usuario!: IUsuario;
  
  
showProfileMenu = false;
currentUser: any = null;

avatar = {
  rol: "Administrador",
  avatar: '../../../assets/avatar.avif'
};

constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

toggleProfileMenu() {
  this.showProfileMenu = !this.showProfileMenu;
}

closeProfileMenu() {
  this.showProfileMenu = false;
}
ngOnInit() {
    this.loadCurrentUser();
  }
  
async loadCurrentUser() {
  try {
    this.currentUser = await this.usuarioService.getCurrentUser()
  } catch (error) {
    console.error('Error cargando usuario:', error);
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
