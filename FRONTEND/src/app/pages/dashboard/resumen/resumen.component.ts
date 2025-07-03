import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})

export class ResumenComponent  {
  arrIngredientes: IIngredientes[] = [];
  // arrEmpleados: IEmpleados[] = [];
  arrRoles: any[] = [];
   IngredientesService = inject(IngredientesService)
 turnosHoy: ITurnos[] = [];
   todayStr: string = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
   turnos: ITurnos[] = [];
  empleadosMap = new Map<number, string>();
  rolesMap = new Map<number, string>();
  
    
  empleadosService = inject(EmpleadosService);
  turnosService = inject(TurnosService);
  rolesService = inject(RolesService);
  authService = inject(AuthService)
  constructor() {
    // Inicializar los mapas
    this.empleadosMap = new Map<number, string>();
    this.rolesMap = new Map<number, string>();
  }

async ngOnInit(){
  let id = this.authService.getUserId()
  this.IngredientesService.getAllIngredientes('usuario', id)
    .then((data: IIngredientes[]) => {
      // Filtrar solo ingredientes con stock bajo o sin stock
      this.arrIngredientes = data
    })
    .catch((error: any) => {
      toast.error(error?.error || 'Error al cargar ingredientes');
    });
    await this.cargarTurnosHoy();
}

 async cargarTurnosHoy() {
  try {
    this.turnosHoy = await this.turnosService.getTurnosByDate(this.todayStr);
    
    // Cargar toda la información de una vez
    await Promise.all([
      this.cargarTodosEmpleados(),
      this.cargarTodosRoles()
    ]);
  } catch (err) {
    console.error('Error cargando turnos del día:', err);
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
}
get todayTurnos(): ITurnos[] {
    return this.turnosHoy.length
      ? this.turnosHoy
      : this.turnos.filter(t => t.fecha === this.todayStr);
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
 
}


