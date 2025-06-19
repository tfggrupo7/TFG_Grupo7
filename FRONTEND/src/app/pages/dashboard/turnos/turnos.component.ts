/**
 * Componente **TurnosComponent**
 * --------------------------------------------------
 * Pantalla principal del módulo de gestión de turnos.
 * Permite visualizar, crear, editar y eliminar turnos
 * de empleados en una cuadrícula horaria semanal.
 */

import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../../core/services/turnos.service';
import { ITurnos } from '../../../interfaces/iturnos.interfaces';
import { TurnosModalComponent } from './turnos-modal/turnos-modal.component';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { RolesService }     from '../../../core/services/roles.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, TurnosModalComponent], // Declaramos dependencias del template (NgIf, NgFor, modal)
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
})
export class TurnosComponent implements OnInit {
  // Accedemos al componente hijo (modal) para abrir/cerrar desde el padre
  @ViewChild(TurnosModalComponent) modalRef!: TurnosModalComponent;

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

  // + maps
  empleadosMap = new Map<number, string>();
  rolesMap     = new Map<number, string>();

  constructor(private turnosService: TurnosService, private empleadosService: EmpleadosService, private rolesService: RolesService) {}

  /**
   * Ciclo de vida — al inicializar:
   *   1. Calcula las fechas de la semana actual.
   *   2. Descarga turnos desde el backend.
   */
  async ngOnInit() {
    // cargar catálogos primero
    const [emps, roles] = await Promise.all([
      this.empleadosService.getEmpleados(),
      this.rolesService.getRoles()
    ]);
    emps.forEach(e => this.empleadosMap.set(e.id, e.nombre));
    roles.forEach(r => this.rolesMap.set(r.id, r.nombre));

    this.setCurrentWeekDates();
    await this.cargarTurnos();
    await this.cargarTurnosHoy();
  }

  /** Descarga la lista de turnos y actualiza `this.turnos` */
  async cargarTurnos() {
    try {
      // (token se valida internamente en el servicio)
      const res = await this.turnosService.getTurnos();
      this.turnos = res;
    } catch (error) {
      // TODO: mostrar notificación UI en vez de solo log
      console.error('Error cargando turnos:', error);
    }
  }

  /**
   * Descarga los turnos correspondientes a la fecha de hoy y actualiza `this.turnosHoy`.
   * Utiliza el servicio para filtrar por la fecha actual (YYYY-MM-DD).
   * Si ocurre un error, lo muestra por consola.
   */
  async cargarTurnosHoy() {
    try {
      this.turnosHoy = await this.turnosService.getTurnosByDate(this.todayStr);
    } catch (err) {
      console.error('Error cargando turnos del día:', err);
    }
  }

  /** Devuelve la fecha de hoy formateada en español (e.g. "Martes, 18 de Junio 2025") */
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
    return `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${
      meses[hoy.getMonth()]
    } ${hoy.getFullYear()}`;
  }

  /** Rellena `currentWeekDates` con las 7 fechas (YYYY‑MM‑DD) de la semana corriente */
  setCurrentWeekDates() {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    // Ajustar a lunes (Intl API: week starts Monday en ES)
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    this.currentWeekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(firstDayOfWeek);
      d.setDate(firstDayOfWeek.getDate() + i);
      return d.toISOString().slice(0, 10); // ISO‑8601 yyyy-MM-dd
    });
  }

  /** Abre modal en modo creación o edición */
  openModal(dayIndex: number, hour: number, turno?: ITurnos) {
    this.selectedDayIndex = dayIndex;
    this.selectedHour = hour;
    this.selectedTurno = turno ?? null;
    this.isModalOpen = true;
  }

  /** Cierra modal y limpia selección */
  closeModal() {
    this.isModalOpen = false;
    this.selectedTurno = null;
  }

  /** Alta de un turno (llamado por output del modal) */
  async createTurno(turno: ITurnos) {
    await this.turnosService.createTurno(turno);
    await this.cargarTurnos(); // refresh grid
    await this.cargarTurnosHoy();
    this.closeModal();
  }

  /** Edición de turno existente */
  async updateTurno(turno: ITurnos) {
    if (!turno.id) return;
    await this.turnosService.updateTurno(turno.id, turno);
    await this.cargarTurnos();
    await this.cargarTurnosHoy();
    this.closeModal();
  }

  /** Borrado hard de turno */
  async deleteTurno() {
    if (!this.selectedTurno?.id) return;
    await this.turnosService.deleteTurno(this.selectedTurno.id);
    await this.cargarTurnos();
    await this.cargarTurnosHoy();
    this.closeModal();
  }

  /** YYYY‑MM‑DD de hoy */
  get todayStr(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Devuelve los turnos correspondientes a la fecha de hoy.
   * Si `turnosHoy` está cargado, lo utiliza; si no, filtra el array general.
   */
  get todayTurnos(): ITurnos[] {
    return this.turnosHoy.length ? this.turnosHoy : this.turnos.filter(t => t.fecha === this.todayStr);
  }
  /** Nº de empleados distintos trabajando hoy */
  get todayStaffCount(): number {
    return new Set(this.todayTurnos.map(t => t.empleado_id)).size;
  }

  /** Métricas KPI mostradas en la cabecera */
  get activeShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'confirmado').length;
  }

  get pendingShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'pendiente').length;
  }

  get completedShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'completado').length;
  }

  /** Habilita drop en las celdas del grid */
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

  /** Devuelve nombre completo del día dado su índice (0=Lunes) */
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

  /** Click en un turno existente: abre modal en modo edición */
  onTurnoClick(turno: ITurnos) {
    const dayIndex = this.currentWeekDates.indexOf(turno.fecha);
    this.openModal(dayIndex, turno.hora, turno);
  }

  calcularDuracion(horaInicio: string, horaFin: string): number {
  if (!horaInicio || !horaFin) return 0;
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);
  return +( (h2 + m2 / 60) - (h1 + m1 / 60) ).toFixed(2);
}

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
