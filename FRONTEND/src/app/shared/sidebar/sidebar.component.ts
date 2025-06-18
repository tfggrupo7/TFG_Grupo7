import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterModule]
})
export class SidebarComponent {
  @Input() isMobile = false;
  sidebarOpen = true;

  showProfileMenu = false;
  avatar = { avatar: 'assets/avatar.avif', rol: 'Empleado' };

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  cerrarSesion() {
    // Aquí va la lógica de logout
  }

  logout() {
    this.cerrarSesion();
  }
}
