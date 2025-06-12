import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITareas } from '../../../interfaces/itareas.interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TareasService } from '../../../core/services/tareas.service';
import { inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { IUsuario } from '../../../interfaces/iusuario.interfaces';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
  imports:[FormsModule, CommonModule,ReactiveFormsModule],
})
export class TareasComponent {
  showModal = false;
  tareas: ITareas[] = [];
  tareasForm!: FormGroup;
 tareasService = inject(TareasService);
 usuario: IUsuario = {
   nombre: '',
   apellidos: '',
   email: '',
   contraseña: ''
 };

  constructor(private fb: FormBuilder) {}

ngOnInit() {
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

  this.obtenerTareas();
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

obtenerTareas() {
  this.tareasService.getTareas().then((respuesta: any) => {  
    
    this.tareas = respuesta.data; 
  });
}

  async insertarTarea() {
    try {
      console.log('Insertando tarea:', this.tareasForm.value);
      await this.tareasService.createTarea(this.tareasForm.value);
      this.closeModal();
      this.obtenerTareas();
    } catch (err: unknown) {
      console.log('Error al insertar la tarea:', err);
      toast.error('Error al insertar la tarea');
    }
  }

getTareasPorEmpleado() {
 
  if (!this.tareas) return {};
  return this.tareas.reduce((acc, tarea) => {
    if (!acc[tarea.empleado_id]) {
      acc[tarea.empleado_id] = [];
    }
    acc[tarea.empleado_id].push(tarea);
    return acc;
  }, {} as { [empleado_id: number]: ITareas[] });
}

eliminarTarea(tareaId: number) {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    this.tareasService.deleteTarea(tareaId).then(() => {
      this.obtenerTareas();
      toast.success('Tarea eliminada correctamente');
    }).catch((err: unknown) => {
      toast.error('Error al eliminar la tarea');
    });

}
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
