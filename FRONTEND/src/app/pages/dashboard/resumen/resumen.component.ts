import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { IRoles } from '../../../interfaces/iroles.interfaces';
import { inject } from '@angular/core';
import { toast } from 'ngx-sonner';


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ResumenComponent  {
   arrEmpleados: IEmpleados[] = [];
  arrRoles: any[] = [];
  empleadoService = inject(EmpleadosService);
async cargarEmpleados() {
  try {
    const userId = Number(this.getUserIdFromToken());
    const empleados = await this.empleadoService.getEmpleados();
    this.arrEmpleados = empleados.filter(
      (emp: IEmpleados) => emp.usuario_id === userId
    );
  } catch (error: any) {
    toast.error(error?.error || 'Error al cargar empleados');
  }
}

getNombreRol(rol_id: number): string {
  const rol = this.arrRoles.find((r: IRoles) => r.id === rol_id);
  return rol ? rol.nombre : 'Sin rol';
}

getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const payload = token.split('.')[1];
  if (!payload) return null;
  
  try {
    const decoded = JSON.parse(atob(payload));
    return decoded.usuario_id || null;
  } catch (e) {
    return null;
  }
}

}


