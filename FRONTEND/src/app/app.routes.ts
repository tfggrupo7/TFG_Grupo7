// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RecuperarContrasenaComponent } from './pages/recuperacion-contrasena/recuperacion-contrasena.component';
import { RestablecerContrasenaComponent } from './pages/restablecer-contrasena/restablecer-contrasena.component';
import { ResumenComponent } from './pages/dashboard/resumen/resumen.component';
import { InventarioComponent } from './pages/dashboard/inventario/inventario.component';
import { PersonalComponent } from './pages/dashboard/personal/personal.component';
import { TurnosComponent } from './pages/dashboard/turnos/turnos.component';
import { ReportesComponent } from './pages/dashboard/reportes/reportes.component';
import { AjustesComponent } from './pages/dashboard/ajustes/ajustes.component';
import { loginGuard } from './core/guards/login.guards';
import { Error404Component } from './pages/error404/error404.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [loginGuard], children: [
      { path: '', component: ResumenComponent },
      { path: 'inventory', component: InventarioComponent },
      { path: 'personal', component: PersonalComponent },
      { path: 'turnos', component: TurnosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'ajustes', component: AjustesComponent }
    ] },
  { path: 'recuperacion-contrasena', component: RecuperarContrasenaComponent},
  { path: 'restablecer-contrasena/:token', component: RestablecerContrasenaComponent , canActivate: [loginGuard] },
  { path: '**', component: Error404Component }
];