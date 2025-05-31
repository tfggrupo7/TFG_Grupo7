// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RecuperarContrasenaComponent } from './pages/recuperacion-contrasena/recuperacion-contrasena.component';
import { RestablecerContrasenaComponent } from './pages/restablecer-contrasena/restablecer-contrasena.component';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'recuperacion-contrasena', component: RecuperarContrasenaComponent},
  { path: 'restablecer-contrasena/:token', component: RestablecerContrasenaComponent},
  { path: '**', redirectTo: '' }
];