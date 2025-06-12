import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITareas } from '../../../interfaces/itareas.interfaces';
import { TareasService } from '../../../core/services/tareas.service';
import { inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { jwtDecode } from 'jwt-decode';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas-empleados.component.html',
  styleUrls: ['./tareas-empleados.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TareasEmpleadosComponent {
  empleados!: IEmpleados[];
  tareas: ITareas[] = [];
  tareasService = inject(TareasService);
   showModal = false;
    tareasForm!: FormGroup;
    role: string[] = [];

constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const empleadoId = this.getEmpleadoIdFromToken();
    console.log('ID del empleado obtenido del token:', empleadoId);
    if (empleadoId) {
      this.getTareasPorEmpleadoId(empleadoId);
    } else {
      toast.error('No se pudo obtener el ID del empleado del token');
    }

    this.tareasForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    fecha_inicio: ['', Validators.required],
    fecha_finalizacion: ['', Validators.required],
    hora_inicio: ['', Validators.required],
    hora_finalizacion: ['', Validators.required],
    estado: ['', Validators.required],
    empleado_id: ['', Validators.required]
  });
// Obtener el rol del empleado desde el token
  }

  openModal() {
    this.showModal = true;
    
  }

  closeModal() {
    this.showModal = false;
  }
getEstadoTarea(tarea: any): string {
  const ahora = new Date();

  // Combina fecha y hora para comparar correctamente
  const fechaInicio = new Date(`${tarea.fecha_inicio}T${tarea.hora_inicio}`);
  const fechaFin = new Date(`${tarea.fecha_finalizacion}T${tarea.hora_finalizacion}`);

  if (ahora < fechaInicio) {
    return 'Pendiente';
  } else if (ahora >= fechaInicio && ahora <= fechaFin) {
    return 'En Curso';
  } else if (ahora > fechaFin) {
    return 'Completada';
  }
  return tarea.estado || 'Pendiente';
}

async insertarTarea() {
    try {
      console.log('Insertando tarea:', this.tareasForm.value);
      console.log('ID del empleado obtenido del token:', this.getEmpleadoIdFromToken());
      const empleadoId = this.getEmpleadoIdFromToken();
      if (!empleadoId) {
        toast.error('No se pudo obtener el ID del empleado');
        return;
      }
      await this.tareasService.createTarea({
        ...this.tareasForm.value,
        empleado_id: empleadoId 
      });
      this.closeModal();
      this.getTareasPorEmpleadoId(empleadoId);
    } catch (err: unknown) {
      console.log('Error al insertar la tarea:', err);
      toast.error('Error al insertar la tarea');
    }
  }

  getTareasPorEmpleadoId(empleadoId: number) {
    this.tareasService
      .getTareasAndEmpleadoById(empleadoId)
      .then((respuesta: any) => {
        // respuesta ES el array de tareas
        this.tareas = Array.isArray(respuesta) ? respuesta : [];
        if (this.tareas.length === 0) {
          toast.info('No hay tareas asignadas a este empleado');
        }
      })
      .catch((err: unknown) => {
        console.error('Error al obtener las tareas:', err);
        toast.error('Error al obtener las tareas');
      });
  }

  getEmpleadoIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || decoded.empleadoId || null;
    } catch (e) {
      return null;
    }
  }

  enviarTareasPorEmail() {
    const empleadoId = this.getEmpleadoIdFromToken();
    if (!empleadoId) {
      toast.error('No se pudo obtener el ID del empleado');
      return;
    }
    // Obtener el email del token
    const token = localStorage.getItem('token');
    let email: string | null = null;
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        email = decoded.email || null;
      } catch (e) {
        email = null;
      }
    }
    if (!email) {
      toast.error('No se pudo obtener el email del empleado');
      return;
    }
    this.tareasService
      .sendTareasEmpleadoByEmail(empleadoId, email)
      .then(() => {
        toast.success('Tareas enviadas por correo electrónico correctamente');
      })
      .catch((err: unknown) => {
        console.error(
          'Error al enviar las tareas por correo electrónico:',
          err
        );
        toast.error('Error al enviar las tareas por correo electrónico');
      });
  }
  descargarTareas() {
    const empleadoId = this.getEmpleadoIdFromToken();
    console.log('EmpleadoId obtenido del token:', empleadoId);
    if (!empleadoId) {
      alert('No se pudo obtener el ID del empleado');
      return;
    }
    this.tareasService
      .downloadTareasPorId(empleadoId)
      .then((respuesta: any) => {
        const blob = new Blob([respuesta], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tareas de empleado.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((err: unknown) => {
        toast.error('Error al descargar las tareas');
      });
  }
  
}
