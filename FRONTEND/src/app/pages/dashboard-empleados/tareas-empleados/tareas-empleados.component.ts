import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITareas } from '../../../interfaces/itareas.interfaces';
import { TareasService } from '../../../core/services/tareas.service';
import { inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas-empleados.component.html',
  styleUrls: ['./tareas-empleados.component.css'],
  imports:[CommonModule],
})
export class TareasEmpleadosComponent {
  empleados!:IEmpleados[];
  tareas: ITareas[] = [];
  tareasService = inject(TareasService);
  

ngOnInit() {
  const empleadoId = this.getEmpleadoIdFromToken();
  if (empleadoId) {
    this.getTareasPorEmpleadoId(empleadoId);
  } else {
    toast.error('No se pudo obtener el ID del empleado del token');
  }
}
getTareasPorEmpleadoId(empleadoId: number) {
  this.tareasService.getTareasAndEmpleadoById(empleadoId).then((respuesta: any) => {
    // respuesta ES el array de tareas
    this.tareas = Array.isArray(respuesta) ? respuesta : [];
    if (this.tareas.length === 0) {
      toast.info('No hay tareas asignadas a este empleado');
    }
  }).catch((err: unknown) => {
    console.error('Error al obtener las tareas:', err);
    toast.error('Error al obtener las tareas');
  }); 
}

getEmpleadoIdFromToken(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  // Los JWT tienen 3 partes: header.payload.signature
  const payload = token.split('.')[1];
  if (!payload) return null;
  // Decodifica el payload de base64
  const decodedPayload = JSON.parse(atob(payload));
  // Ajusta el nombre del campo según tu backend: id, empleadoId, userId, etc.
  return decodedPayload.id || decodedPayload.empleadoId || null;
}
  



enviarTareasPorEmail() {
  this.tareasService.sendTareasByEmail(this.tareas).then(() => {
    toast.success('Tareas enviadas por correo electrónico correctamente');
  }).catch((err: unknown) => {
    console.error('Error al enviar las tareas por correo electrónico:', err);
    toast.error('Error al enviar las tareas por correo electrónico');
  });
}
descargarTareas() {
  this.tareasService.downloadTareas().then((respuesta: any) => {
    const blob = new Blob([respuesta], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tareas.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }).catch((err: unknown) => {
    
    toast.error('Error al descargar las tareas');
  });     
}
}
