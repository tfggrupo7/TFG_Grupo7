// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ResumenComponent } from './pages/dashboard/resumen/resumen.component';
import { InventarioComponent } from './pages/dashboard/inventario/inventario.component';
import { PersonalComponent } from './pages/dashboard/personal/personal.component';
import { TurnosComponent } from './pages/dashboard/turnos/turnos.component';
import { ReportesComponent } from './pages/dashboard/reportes/reportes.component';
import { AjustesComponent } from './pages/dashboard/ajustes/ajustes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: ResumenComponent },
      { path: 'inventory', component: InventarioComponent },
      { path: 'personal', component: PersonalComponent },
      { path: 'turnos', component: TurnosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'ajustes', component: AjustesComponent }
    ]
  }
];
