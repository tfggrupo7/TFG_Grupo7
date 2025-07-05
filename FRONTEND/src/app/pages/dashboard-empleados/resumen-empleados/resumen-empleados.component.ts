import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { ITurnos } from '../../../interfaces/iturnos.interfaces';
import { inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { IIngredientes } from '../../../interfaces/iingredientes.interfaces';
import { IngredientesService } from '../../../core/services/ingredientes.service';
import { TurnosService } from '../../../core/services/turnos.service';
import { RolesService } from '../../../core/services/roles.service';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-resumen-empleados',
  imports: [RouterModule, CommonModule],
  templateUrl: './resumen-empleados.component.html',
  styleUrl: './resumen-empleados.component.css'
})
export class ResumenEmpleadosComponent {

  arrIngredientes: IIngredientes[] = [];
  arrEmpleados: IEmpleados[] = [];
  arrRoles: any[] = [];
  empleadoService = inject(EmpleadosService);
  IngredientesService = inject(IngredientesService)
 
     todayStr: string = new Date().toISOString().split('T')[0]; 
     turnos: ITurnos[] = [];
    empleadosMap = new Map<number, string>();
    rolesMap = new Map<number, string>();
    
constructor(
  private empleadosService: EmpleadosService,
  private turnosService: TurnosService,
  private rolesService: RolesService,
  private authService: AuthService
) {}

ngOnInit(){
  let id = this.authService.getEmpleadoId()
  this.IngredientesService.getAllIngredientes('empleado', id)
    .then((data: IIngredientes[]) => {
      // Filtrar solo ingredientes con stock bajo o sin stock
      this.arrIngredientes = data;
    })
    .catch((error: any) => {
      toast.error(error?.error || 'Error al cargar ingredientes');
    });
  this.cargarTurnos();
  this.cargarTodosEmpleados();
  this.cargarTodosRoles();
}


  async cargarTurnos() {
    try {
      const data = await this.turnosService.getTurnos();
      // Filtrar solo los turnos de hoy (en zona horaria de España)
      const today = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Madrid'
      }).format(new Date());

      this.turnos = data.filter((t: ITurnos) => {
        const turnoDate = new Date(t.fecha);
        const fechaStr = new Intl.DateTimeFormat('sv-SE', {
          timeZone: 'Europe/Madrid'
        }).format(turnoDate);
        return fechaStr === today;
      });
    } catch (error) {
      console.error('Error cargando turnos:', error);
    }
  }

  
private getEmpleadoLogueadoId(): number | null {
   const empleadoId = localStorage.getItem('empleado_id');
  return empleadoId ? parseInt(empleadoId) : null;
 
}
getEstadoAutomatico(turno: any): string {
  const ahora = new Date();
  
  // Crear fechas completas para comparar
  const fechaTurno = new Date(turno.fecha);
  const [horaInicio, minutoInicio] = turno.hora_inicio.split(':').map(Number);
  const [horaFin, minutoFin] = turno.hora_fin.split(':').map(Number);
  
  const inicioTurno = new Date(fechaTurno);
  inicioTurno.setHours(horaInicio, minutoInicio, 0, 0);
  
  const finTurno = new Date(fechaTurno);
  finTurno.setHours(horaFin, minutoFin, 0, 0);
  
  // Determinar estado según la hora actual
  if (ahora > finTurno) {
    return 'completado';
  } else if (ahora >= inicioTurno && ahora <= finTurno) {
    return 'confirmado';
  } else {
    return 'pendiente';
  }
}


  
  async cargarTodosEmpleados() {
    try {
      const empleados = await this.empleadosService.getEmpleados();
      this.empleadosMap.clear();
      empleados.forEach(emp => {
        this.empleadosMap.set(emp.id, `${emp.nombre} ${emp.apellidos}`);
      });
    } catch (err) {
      console.error('Error cargando empleados:', err);
    }
  }
  
  async cargarTodosRoles() {
    try {
      const roles = await this.rolesService.getRoles();
      this.rolesMap.clear();
      roles.forEach(rol => {
        this.rolesMap.set(rol.id, rol.nombre);
      });
    } catch (err) {
      console.error('Error cargando roles:', err);
    }
  
  
  // Fecha actual en España
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Madrid'
  }).format(new Date());
  
  
  return this.turnos.filter(t => {
      
    // Convertir la fecha del turno a zona horaria de España
    const turnoDate = new Date(t.fecha);
    const fechaStr = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Madrid'
    }).format(turnoDate);
    
       
    return fechaStr === today;
  });
}
  
  get todayFormatted(): string {
      const hoy = new Date();
      const dias = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ];
    const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ];
      return `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${meses[hoy.getMonth()]
        } ${hoy.getFullYear()}`;
    }
  
       calcularDuracion(horaInicio: string, horaFin: string): number {
      if (!horaInicio || !horaFin) return 0;
      const [h1, m1] = horaInicio.split(':').map(Number);
      const [h2, m2] = horaFin.split(':').map(Number);
      return +((h2 + m2 / 60) - (h1 + m1 / 60)).toFixed(2);
    }
  
    /**
     * Devuelve la clase CSS correspondiente al estado del turno.
     * Permite colorear visualmente los turnos según su estado.
     */
    getEstadoClase(estado: string): string {
      switch (estado?.toLowerCase()) {
        case 'completado':
          return 'bg-green-100 text-green-700 border border-green-300';
        case 'pendiente':
          return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
        case 'confirmado':
          return 'bg-blue-100 text-blue-700 border border-blue-300';
        default:
          return 'bg-gray-100 text-gray-700 border border-gray-300';
      }
    }
   

}

