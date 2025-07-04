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
import { PerfilComponent } from './pages/dashboard/perfil/perfil.component';
import { LoginEmpleadosComponent } from './pages/login-empleados/login-empleados.component';
import { RecuperacionContrasenaEmpleadosComponent } from './pages/recuperacion-contrasena-empleados/recuperacion-contrasena-empleados.component';
import { RestablecerContrasenaEmpleadosComponent } from './pages/restablecer-contrasena-empleados/restablecer-contrasena-empleados.component';
import { DashboardEmpleadosComponent } from './pages/dashboard-empleados/dashboard-empleados.component';
import { TurnosEmpleadosComponent } from './pages/dashboard-empleados/turnos-empleados/turnos-empleados.component';
import { PerfilEmpleadosComponent } from './pages/dashboard-empleados/perfil-empleados/perfil-empleados.component';
import { ResumenEmpleadosComponent } from './pages/dashboard-empleados/resumen-empleados/resumen-empleados.component';
import { TareasEmpleadosComponent } from './pages/dashboard-empleados/tareas-empleados/tareas-empleados.component';
import { TareasComponent } from './pages/dashboard/tareas/tareas.component';
import { VideoDemoComponent } from './pages/video-demo/video-demo.component';


export const routes: Routes = [
{ path: '', component: LandingComponent },
{ path: 'login', component: LoginComponent },
{ path: 'dashboard', component: DashboardComponent,canActivate: [loginGuard], children: [
    { path: '', component: ResumenComponent },
    { path: 'inventory', component: InventarioComponent },
    { path: 'personal', component: PersonalComponent },
    { path: 'turnos', component: TurnosComponent },
    { path: 'reportes', component: ReportesComponent },
    { path: 'ajustes', component: AjustesComponent },
    { path: 'perfil', component: PerfilComponent},
    { path: 'tareas', component: TareasComponent}
  ] },
{ path:'dashboard-empleados',component:DashboardEmpleadosComponent, canActivate: [loginGuard], children: [
    { path: '', component: ResumenEmpleadosComponent },
    { path: 'inventario-empleados', component: InventarioComponent },
    { path: 'turnos-empleados', component: TurnosEmpleadosComponent },
    { path: 'perfil-empleados', component: PerfilEmpleadosComponent},
    { path: 'tareas-empleados', component: TareasEmpleadosComponent }
  ]},
  { path:'empleados/login',component:LoginEmpleadosComponent},
  { path:'empleados/recuperacion-contrasena',component: RecuperacionContrasenaEmpleadosComponent},
  { path:'empleados/restablecer-contrasena/:token',component: RestablecerContrasenaEmpleadosComponent},
  { path: 'recuperacion-contrasena', component: RecuperarContrasenaComponent},
  { path: 'restablecer-contrasena/:token', component: RestablecerContrasenaComponent  },
  { path: 'video-demo', component: VideoDemoComponent},
  { path: '**', component: Error404Component }
];
