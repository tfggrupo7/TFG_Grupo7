import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../../core/services/turnos.service';
import { ITurnos } from '../../../interfaces/iturnos.interfaces';
import { TurnosModalEmpleadosComponent } from './turnos-modal-empleados/turnos-modal-empleados.component';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { RolesService } from '../../../core/services/roles.service';
import { toast } from 'ngx-sonner';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-turnos-empleados',
  imports: [CommonModule, TurnosModalEmpleadosComponent],
  templateUrl: './turnos-empleados.component.html',
  styleUrl: './turnos-empleados.component.css',
})
export class TurnosEmpleadosComponent {
  // Accedemos al componente hijo (modal) para abrir/cerrar desde el padre
  @ViewChild(TurnosModalEmpleadosComponent)
  modalRef!: TurnosModalEmpleadosComponent;

  empleadosMap = new Map<number, string>();
  rolesMap = new Map<number, string>();
  rolesArray: any[] = [];
  currentUserRole: any = '';
  empleadoId: string = '';
  turnosEmpleado: any[] = [];
  turnosPorDia: { [fecha: string]: ITurnos[] } = {};
  

  /** Array completo de turnos cargado desde la API */
  turnos: ITurnos[] = [];

  draggedTurno: ITurnos | null = null;

  turnosHoy: ITurnos[] = [];

  /** Fechas (YYYY‑MM‑DD) de la semana actual, lunes → domingo */
  currentWeekDates: string[] = [];

  /** Array [0..23] para renderizar filas de la cuadrícula horaria */
  hours = Array.from({ length: 24 }, (_, i) => i);

  /** Índice de día seleccionado (0=Lunes, 6=Domingo) al abrir el modal */
  selectedDayIndex = 0;

  /** Hora seleccionada al abrir el modal (0‑23) */
  selectedHour = 0;

  /** Turno actualmente seleccionado (para editar) */
  selectedTurno: ITurnos | null = null;

  /** Flag que controla la visibilidad del modal */
  isModalOpen = false;
  cdr: any;

  // + maps

  constructor(
    private turnosService: TurnosService,
    private empleadosService: EmpleadosService,
    private rolesService: RolesService
  ) {}

  /**
   * Ciclo de vida — al inicializar:
   *   1. Calcula las fechas de la semana actual.
   *   2. Descarga turnos desde el backend.
   */
  async ngOnInit() {
    this.currentUserRole = this.getCurrentUserRole();
    // cargar catálogos primero
    const [emps, roles] = await Promise.all([
      this.empleadosService.getEmpleados(),
      this.rolesService.getRoles(),
    ]);

    emps.forEach((e) => this.empleadosMap.set(e.id, e.nombre));
    roles.forEach((r) => this.rolesMap.set(r.id, r.nombre));
    this.rolesArray = roles;

    this.setCurrentWeekDates();
    const empleadoIdFromToken = this.getEmpleadoIdFromToken();
    this.empleadoId = empleadoIdFromToken !== null ? String(empleadoIdFromToken) : '';
    await this.cargarTurnos();
    await this.cargarTurnosHoy();
  this.turnos = await this.turnosService.getTurnos();
 
  }

  getRoleIdByName(roleName: string): number | null {
    const role = this.rolesArray.find((r) => r.nombre === roleName);
    return role ? role.id : null;
  }

  getCurrentUserRole(): string {
  // Opción 1: Desde localStorage
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch (error) {
      return '';
    }
  }
  
  // Opción 2: Si tienes un servicio de auth
  // return this.authService.getCurrentUserRole();
  
  return '';
}
  /**
   * Obtiene el ID del empleado logueado desde localStorage o token
   */
  getEmpleadoLogueadoId(): number | null {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenData = this.decodeToken(token);
        return tokenData.empleado_id || tokenData.sub || tokenData.id || null;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decodifica un token JWT
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }
async cargarTurnos() {
    try {
      const empleadoIdFromToken = this.getEmpleadoIdFromToken();
      this.empleadoId = empleadoIdFromToken !== null ? String(empleadoIdFromToken) : '';
      const empleadoIdNumber = Number(this.empleadoId);
      
      
      const todosTurnos = await this.turnosService.getTurnos();
      
      // Usar la nueva propiedad (NO readonly)
      this.turnosEmpleado = todosTurnos.filter((turno, index) => {
        const coincide = turno.empleado_id === empleadoIdNumber;
        return coincide;
      });
      
      
      
    } catch (error) {
      console.error('Error cargando turnos:', error);
    }
  }
  

  async cargarTurnosHoy() {
    try {
      const empleadoId = this.getEmpleadoLogueadoId();

      if (!empleadoId) {
        this.turnosHoy = [];
        return;
      }

      // Si ya tenemos turnos cargados, filtrar de ahí
      if (this.turnos.length > 0) {
        this.turnosHoy = this.turnos.filter((t) => t.fecha === this.todayStr);

        return;
      }

      // Timeout para esta llamada también
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout getTurnosByDate')), 10000)
      );

      const turnosPromise = this.turnosService.getTurnosByDate(this.todayStr);

      const turnosDelDia = (await Promise.race([
        turnosPromise,
        timeoutPromise,
      ])) as ITurnos[];

      this.turnosHoy = turnosDelDia.filter(
        (turno) => turno.empleado_id === empleadoId
      );
    } catch (err: any) {
      this.turnosHoy = [];
    }
  }

  /**
   * Obtiene el nombre del día en español para una fecha dada
   */
  getDayNameFromDate(fecha: string): string {
    const date = new Date(fecha + 'T12:00:00'); // Evitar problemas de timezone
    const dayIndex = (date.getDay() + 6) % 7; // Convertir domingo=0 a lunes=0
    return this.getDayName(dayIndex);
  }

  /**
   * Devuelve los turnos del empleado logueado para toda la semana actual
   */
  get weekTurnos(): ITurnos[] {
    const empleadoId = this.getEmpleadoLogueadoId();
    if (!empleadoId) return [];

    // Convertir currentWeekDates a formato YYYY-MM-DD para comparación
    const weekDatesFormatted = this.currentWeekDates.map((date) => {
      if (typeof date === 'string') {
        return date.split('T')[0]; // Si viene con hora, tomar solo la fecha
      }
      return new Date(date).toISOString().split('T')[0];
    });

    return this.turnos.filter((turno) => {
      // Normalizar la fecha del turno
      let turnoFecha = turno.fecha;
      if (typeof turnoFecha === 'string') {
        turnoFecha = turnoFecha.split('T')[0];
      } else {
        turnoFecha = new Date(turnoFecha).toISOString().split('T')[0];
      }

      return (
        weekDatesFormatted.includes(turnoFecha) &&
        turno.empleado_id === empleadoId
      );
    });
  }

  /**
   * Agrupa los turnos de la semana por fecha
   */
  get weekTurnosGrouped(): { [fecha: string]: ITurnos[] } {
    const grouped: { [fecha: string]: ITurnos[] } = {};

    // Inicializar todos los días de la semana
    this.currentWeekDates.forEach((fecha) => {
      grouped[fecha] = [];
    });

    // Agrupar turnos por fecha
    this.weekTurnos.forEach((turno) => {
      if (grouped[turno.fecha]) {
        grouped[turno.fecha].push(turno);
      }
    });

    return grouped;
  }

  /**
   * Formatea una fecha para mostrar (ej: "Lunes 20")
   */
  formatDateForDisplay(fecha: string): string {
    const date = new Date(fecha + 'T12:00:00');
    const dayName = this.getDayNameFromDate(fecha);
    const dayNumber = date.getDate();
    return `${dayName} ${dayNumber}`;
  }

  /**
   * Devuelve la fecha de hoy formateada en español (e.g. "Martes, 18 de Junio 2025").
   * Utiliza arrays de días y meses para mostrar el nombre completo.
   */ get todayFormatted(): string {
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
    return `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${
      meses[hoy.getMonth()]
    } ${hoy.getFullYear()}`;
  }

  /**
   * Calcula y rellena `currentWeekDates` con las 7 fechas (YYYY‑MM‑DD) de la semana corriente.
   * El primer día es lunes y el último domingo, siguiendo la convención española.
   */ setCurrentWeekDates() {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    // Ajustar a lunes (Intl API: week starts Monday en ES)
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    this.currentWeekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(firstDayOfWeek); // lunes base
      d.setDate(d.getDate() + i); // +0…6 días
      d.setHours(12, 0, 0, 0); // ← fija a 12:00 local
      return d.toISOString().slice(0, 10); // YYYY-MM-DD correcto
    });
  }

  /**
   * Abre el modal para crear o editar un turno.
   * Recibe el índice del día, la hora y opcionalmente el turno a editar.
   * Actualiza los estados internos para el modal.
   */ openModal(dayIndex: number, hour: number, turno?: ITurnos) {
    this.selectedDayIndex = dayIndex;
    this.selectedHour = hour;
    this.selectedTurno = turno ?? null;
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal y limpia la selección de turno.
   * Restablece los flags y variables asociadas al modal.
   */ closeModal() {
    this.isModalOpen = false;
    this.selectedTurno = null;
  }

  /**
   * Alta de un turno (llamado por output del modal).
   * Envía el nuevo turno al backend, refresca la cuadrícula y cierra el modal.
   */ async createTurno(turno: ITurnos) {
    await this.turnosService.createTurno(turno);
    await this.cargarTurnos(); // refresh grid
    await this.cargarTurnosHoy();
    this.closeModal();
  }

  /**
   * Edición de turno existente.
   * Actualiza el turno en el backend, refresca la cuadrícula y cierra el modal.
   */ async updateTurno(turno: ITurnos) {
    if (!turno.id) return;
    await this.turnosService.updateTurno(turno.id, turno);
    await this.cargarTurnos();
    await this.cargarTurnosHoy();
    this.closeModal();
  }

  /**
   * Borrado hard de turno seleccionado.
   * Elimina el turno en el backend, refresca la cuadrícula y cierra el modal.
   */ async deleteTurno() {
    if (!this.selectedTurno?.id) return;
    await this.turnosService.deleteTurno(this.selectedTurno.id);
    await this.cargarTurnos();
    await this.cargarTurnosHoy();
    this.closeModal();
  }

  /**
   * Devuelve la fecha de hoy en formato YYYY‑MM‑DD (ISO 8601).
   * Se utiliza para filtrar turnos del día.
   */ get todayStr(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // fuerza horario local
    return d.toISOString().slice(0, 10);
  }

  /**
   * Devuelve los turnos correspondientes a la fecha de hoy.
   * Si `turnosHoy` está cargado, lo utiliza; si no, filtra el array general.
   */
  get todayTurnos(): ITurnos[] {
    return this.turnosHoy.length
      ? this.turnosHoy
      : this.turnos.filter((t) => t.fecha === this.todayStr);
  }

  /** Métricas KPI mostradas en la cabecera */
  get activeShiftsCount(): number {
    const count = this.turnos.filter((t) => t.estado.toLowerCase() === 'confirmado').length;
    
    return count;
  }

  /**
   * Devuelve el número de turnos pendientes (estado 'pendiente').
   * Se utiliza como métrica KPI en la cabecera.
   */
  get pendingShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'pendiente')
      .length;
  }

  /**
   * Devuelve el número de turnos completados (estado 'completado').
   * Se utiliza como métrica KPI en la cabecera.
   */
  get completedShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'completado')
      .length;
  }

  /**
   * Permite el drop en las celdas del grid de turnos.
   * Previene el comportamiento por defecto del navegador.
   */
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  /** Guarda el turno que se está arrastrando */
  onDragStart(turno: ITurnos) {
    this.draggedTurno = turno;
  }

  /**
   * Drop handler: actualiza turno con nueva fecha/hora.
   * Reutiliza `updateTurno` para persistir el cambio.
   */
  async onDrop(event: DragEvent, dayIndex: number, hour: number) {
    event.preventDefault();
    if (this.draggedTurno) {
      this.draggedTurno.fecha = this.currentWeekDates[dayIndex];
      this.draggedTurno.hora = hour;
      this.draggedTurno.hora_inicio = `${hour.toString().padStart(2, '0')}:00`;
      const endHour = hour + this.draggedTurno.duracion;
      this.draggedTurno.hora_fin = `${endHour.toString().padStart(2, '0')}:00`;

      // Actualiza en backend
      await this.updateTurno(this.draggedTurno);

      this.draggedTurno = null;
    }
  }

  /**
   * Devuelve el nombre completo del día de la semana dado su índice (0=Lunes).
   * Utilizado para mostrar encabezados de la cuadrícula.
   */
  getDayName(index: number): string {
    return [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ][index];
  }

  /**
   * Click en un turno existente: abre el modal en modo edición.
   * Calcula el índice del día y la hora del turno seleccionado.
   */
  onTurnoClick(turno: ITurnos) {
    const dayIndex = this.currentWeekDates.indexOf(turno.fecha);
    this.openModal(dayIndex, turno.hora, turno);
  }

  /**
   * Calcula la duración en horas decimales entre dos horas (formato HH:mm).
   * Devuelve el resultado redondeado a dos decimales.
   */
  calcularDuracion(horaInicio: string, horaFin: string): number {
    if (!horaInicio || !horaFin) return 0;
    const [h1, m1] = horaInicio.split(':').map(Number);
    const [h2, m2] = horaFin.split(':').map(Number);
    return +(h2 + m2 / 60 - (h1 + m1 / 60)).toFixed(2);
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
  
    enviarTurnosPorEmail() {
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
      this.turnosService
        .sendTurnosEmpleadoByEmail(empleadoId, email)
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
    descargarTurnos() {
      const empleadoId = this.getEmpleadoIdFromToken();
      console.log('EmpleadoId obtenido del token:', empleadoId);
      if (!empleadoId) {
        alert('No se pudo obtener el ID del empleado');
        return;
      }
      this.turnosService
        .downloadTurnosPorId(empleadoId)
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
