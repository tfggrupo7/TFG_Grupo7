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

  constructor(private turnosService: TurnosService) {}

  /**
   * Ciclo de vida — al inicializar:
   *   1. Calcula las fechas de la semana actual.
   *   2. Descarga turnos desde el backend.
   */
  async ngOnInit() {
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
    console.log('Creating turno:', turno);
    await this.turnosService.createTurno(turno);
    await this.cargarTurnos(); // refresh grid
    this.closeModal();
  }

  /** Edición de turno existente */
  async updateTurno(turno: ITurnos) {
    if (!turno.id) return;
    await this.turnosService.updateTurno(turno.id, turno);
    await this.cargarTurnos();
    this.closeModal();
  }

  /** Borrado hard de turno */
  async deleteTurno() {
    if (!this.selectedTurno?.id) return;
    await this.turnosService.deleteTurno(this.selectedTurno.id);
    await this.cargarTurnos();
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
    this.selectedTurno = turno;
  }

  /**
   * Drop handler: actualiza turno con nueva fecha/hora.
   * Reutiliza `updateTurno` para persistir el cambio.
   */
  async onDrop(event: DragEvent, dayIndex: number, hour: number) {
    event.preventDefault();
    if (!this.selectedTurno) return;

    const updated: ITurnos = {
      ...this.selectedTurno,
      dia: this.getDayName(dayIndex - 1),
      hora: Number(hour),
      fecha: this.currentWeekDates[dayIndex],
      hora_inicio: `${hour.toString().padStart(2, '0')}:00`,
      hora_fin: `${(hour + this.selectedTurno.duracion)
        .toString()
        .padStart(2, '0')}:00`,
    };
    await this.updateTurno(updated);
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
}
