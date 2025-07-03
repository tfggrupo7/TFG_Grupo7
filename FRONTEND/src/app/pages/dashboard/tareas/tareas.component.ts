import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITareas } from '../../../interfaces/itareas.interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TareasService } from '../../../core/services/tareas.service';
import { inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { IUsuario } from '../../../interfaces/iusuario.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
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
    contraseña: '',
  };
 empleados: any[] = [];
  tareaSeleccionada: ITareas | null = null;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private empleadoService: EmpleadosService) {}

  async ngOnInit() {
    this.tareasForm = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_finalizacion: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_finalizacion: ['', Validators.required],
      estado: ['', Validators.required],
      empleado_id: ['', Validators.required],
    });

    this.obtenerTareas();
    this.empleadoService.getEmpleados().then(empleados => {
      this.empleados = empleados;
    
    });
    await this.cargarEmpleados();
  }

  async cargarEmpleados() {
    try {
      this.empleados = await this.empleadoService.getEmpleados()
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  }

  getEmpleadosById(id: number) {
    return this.empleados.find(emp => emp.id == id);
  }


  openModal(tarea?: ITareas) {
    if (tarea) {
      this.tareaSeleccionada = tarea;
      this.tareasForm.patchValue(tarea);
    } else {
      this.tareaSeleccionada = null;
      this.tareasForm.reset();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  getEstadoTarea(tarea: any): string {
    const ahora = new Date();

    // Combina fecha y hora para comparar correctamente
    const fechaInicio = new Date(`${tarea.fecha_inicio}T${tarea.hora_inicio}`);
    const fechaFin = new Date(
      `${tarea.fecha_finalizacion}T${tarea.hora_finalizacion}`
    );

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

  private formatDate(date: any): string {
    if (!date) return '';
    // Si ya es string YYYY-MM-DD, devuélvelo
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    // Si es string ISO, recorta
    if (typeof date === 'string' && date.includes('T')) return date.split('T')[0];
    // Si es Date
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return date;
  }

  async insertarTarea() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    try {
      // Formatea fechas antes de enviar
      const formValue = {
        ...this.tareasForm.value,
        fecha_inicio: this.formatDate(this.tareasForm.value.fecha_inicio),
        fecha_finalizacion: this.formatDate(this.tareasForm.value.fecha_finalizacion)
      };
      if (this.tareaSeleccionada && this.tareaSeleccionada.id) {
        await this.tareasService.updateTarea(this.tareaSeleccionada.id, {
          ...formValue,
          id: this.tareaSeleccionada.id
        });
        toast.success('Tarea actualizada correctamente');
      } else {
        const { id, ...tareaSinId } = formValue;
        await this.tareasService.createTarea(tareaSinId);
        toast.success('Tarea creada correctamente');
      }
      this.closeModal();
      this.obtenerTareas();
    } finally {
      this.isSubmitting = false;
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
    const tarea = this.tareas.find((t) => t.id === tareaId);
    const tareaNombre = tarea ? tarea.titulo : 'desconocida';

    toast(`¿Deseas Borrar la tarea ${tareaNombre}?`, {
      action: {
        label: 'Aceptar',
        onClick: async () => {
          try {
            await this.tareasService.deleteTarea(tareaId);
            this.obtenerTareas();
            toast.success('Tarea eliminada correctamente');
          } catch {
            toast.error('Error al eliminar la tarea');
          }
        },
      },
    });
  }
getEmpleadoById(empleadoId: string) {
    return this.empleados.find(emp => emp.id.toString() === empleadoId);
  }
  enviarTareasPorEmail() {
    this.tareasService
      .sendTareasByEmail(this.tareas)
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
    this.tareasService
      .downloadTareas()
      .then((respuesta: any) => {
        const blob = new Blob([respuesta], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tareas.pdf';
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
