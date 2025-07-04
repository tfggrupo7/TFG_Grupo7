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
import { RolesService } from '../../../core/services/roles.service';
import { toast } from 'ngx-sonner';


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

  turnosPorDia: { [fecha: string]: ITurnos[] } = {};

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
  empleadosMap = new Map<number, { nombre: string, apellidos: string }>();
  rolesMap = new Map<number, string>();

  constructor(private turnosService: TurnosService, private empleadosService: EmpleadosService, private rolesService: RolesService) { }

  /**
   * Ciclo de vida — al inicializar:
   *   1. Calcula las fechas de la semana actual.
   *   2. Descarga turnos desde el backend.
   */
  async ngOnInit() {
    // cargar catálogos primero
    const [emps, roles] = await Promise.all([
      this.empleadosService.getEmpleados(),
      this.rolesService.getRoles()
    ]);
    emps.forEach((e) => this.empleadosMap.set(e.id, { nombre: e.nombre, apellidos: e.apellidos }));
    roles.forEach((r) => this.rolesMap.set(r.id, r.nombre));
    

    this.setCurrentWeekDates();
    await this.cargarTurnosSemana();
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

/**
 * Devuelve la fecha de hoy formateada en español (e.g. "Martes, 18 de Junio 2025").
 * Utiliza arrays de días y meses para mostrar el nombre completo.
 */  get todayFormatted(): string {
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

/**
 * Calcula y rellena `currentWeekDates` con las 7 fechas (YYYY‑MM‑DD) de la semana corriente.
 * El primer día es lunes y el último domingo, siguiendo la convención española.
 */  setCurrentWeekDates() {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    // Ajustar a lunes (Intl API: week starts Monday en ES)
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    this.currentWeekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(firstDayOfWeek);   // lunes base
      d.setDate(d.getDate() + i);   // +0…6 días
      d.setHours(12, 0, 0, 0);      // ← fija a 12:00 local
      return d.toISOString().slice(0, 10);  // YYYY-MM-DD correcto
    });
  }

/**
 * Abre el modal para crear o editar un turno.
 * Recibe el índice del día, la hora y opcionalmente el turno a editar.
 * Actualiza los estados internos para el modal.
 */  openModal(dayIndex: number, hour: number, turno?: ITurnos) {
    this.selectedDayIndex = dayIndex;
    this.selectedHour = hour;
    this.selectedTurno = turno ?? null;
    this.isModalOpen = true;
  }

/**
 * Cierra el modal y limpia la selección de turno.
 * Restablece los flags y variables asociadas al modal.
 */  closeModal() {
    this.isModalOpen = false;
    this.selectedTurno = null;
  }

/**
 * Alta de un turno (llamado por output del modal).
 * Envía el nuevo turno al backend, refresca la cuadrícula y cierra el modal.
 */ async createTurno(turno: ITurnos) {
  await this.turnosService.createTurno(turno);
  await this.cargarTurnos(); // refresca array general
  await this.cargarTurnosHoy(); // refresca turnos de hoy
  await this.cargarTurnosSemana(); // <-- añade esta línea para refrescar el calendario semanal
  this.closeModal();
}

/**
 * Edición de turno existente.
 * Actualiza el turno en el backend, refresca la cuadrícula y cierra el modal.
 */  async updateTurno(turno: ITurnos) {
  if (!turno.id) return;
  await this.turnosService.updateTurno(turno.id, turno);
  await this.cargarTurnos();
  await this.cargarTurnosHoy();
  await this.cargarTurnosSemana();
  this.closeModal();
}

/**
 * Borrado hard de turno seleccionado.
 * Elimina el turno en el backend, refresca la cuadrícula y cierra el modal.
 */  async deleteTurno() {
    if (!this.selectedTurno?.id) return;
    await this.turnosService.deleteTurno(this.selectedTurno.id);
    await this.cargarTurnos();
    await this.cargarTurnosHoy();
    await this.cargarTurnosSemana();
    this.closeModal();
  }

/**
 * Devuelve la fecha de hoy en formato YYYY‑MM‑DD (ISO 8601).
 * Se utiliza para filtrar turnos del día.
 */  get todayStr(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());   // fuerza horario local
    return d.toISOString().slice(0, 10);
  }

  /**
   * Devuelve los turnos correspondientes a la fecha de hoy.
   * Si `turnosHoy` está cargado, lo utiliza; si no, filtra el array general.
   */
  get todayTurnos(): ITurnos[] {
    return this.turnosHoy.length
      ? this.turnosHoy
      : this.turnos.filter(t => t.fecha === this.todayStr);
  }
  /** Nº de empleados distintos trabajando hoy */
  get todayStaffCount(): number {
    return new Set(this.todayTurnos.map(t => t.empleado_id)).size;
  }

  /** Métricas KPI mostradas en la cabecera */
  get activeShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'confirmado').length;
  }

  /**
 * Devuelve el número de turnos pendientes (estado 'pendiente').
 * Se utiliza como métrica KPI en la cabecera.
 */
  get pendingShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'pendiente').length;
  }

  /**
 * Devuelve el número de turnos completados (estado 'completado').
 * Se utiliza como métrica KPI en la cabecera.
 */
  get completedShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'completado').length;
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
      // Guardamos la duración original calculada desde hora_inicio y hora_fin
      const duracionOriginal = this.calcularDuracion(this.draggedTurno.hora_inicio, this.draggedTurno.hora_fin);

      // Cambia la fecha al nuevo día
      this.draggedTurno.fecha = this.currentWeekDates[dayIndex];
      this.draggedTurno.hora = hour;

      // Preservamos los minutos originales del turno
      const [origH, origM] = this.draggedTurno.hora_inicio.split(':').map(Number);

      // Nueva hora de inicio con la hora de destino pero manteniendo los minutos originales
      const newHoraInicio = `${hour.toString().padStart(2, '0')}:${(origM || 0).toString().padStart(2, '0')}`;
      this.draggedTurno.hora_inicio = newHoraInicio;

      // Calculamos la nueva hora de fin basándonos en la duración original
      const totalMin = hour * 60 + (origM || 0) + (duracionOriginal * 60);
      let finH = Math.floor(totalMin / 60);
      let finM = Math.floor(totalMin % 60);

      // Manejo de casos especiales
      if (finM === 60) {
        finH += 1;
        finM = 0;
      }

      this.draggedTurno.hora_fin = `${finH.toString().padStart(2, '0')}:${finM.toString().padStart(2, '0')}`;

      // Actualizamos la duración para mantener consistencia
      this.draggedTurno.duracion = duracionOriginal;

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
  enviarTurnosPorEmail() {
      this.turnosService
        .sendTurnosByEmail(this.turnos)
        .then(() => {
          toast.success('Turnos enviados por correo electrónico correctamente');
        })
        .catch((err: unknown) => {
          console.error(
            'Error al enviar los turnos por correo electrónico:',
            err
          );
          toast.error('Error al enviar las tareas por correo electrónico');
        });
    }
  descargarTurnos() {
    this.turnosService
    .downloadTurnos()
    .then((respuesta: any) => {
      const blob = new Blob([respuesta], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'turnos.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((err: unknown) => {
      console.error('Error al descargar los turnos:', err);
      toast.error('Error al descargar los turnos');
    });
  }

  async cargarTurnosSemana() {
    this.turnosPorDia = {};
    for (const fecha of this.currentWeekDates) {
      try {
        this.turnosPorDia[fecha] = await this.turnosService.getTurnosByDate(fecha);
      } catch (err) {
        this.turnosPorDia[fecha] = [];
        console.error('Error cargando turnos para', fecha, err);
      }
    }
  }
  /**
   * Devuelve la posición (en px) desde arriba según la hora de inicio.
   * Ejemplo: "08:30" => 510 si cada hora son 60px.
   */
  getTurnoTop(hora_inicio: string): number {
    const [h, m] = hora_inicio.split(':').map(Number);
    return h * 60 + (m || 0); // 1px = 1minuto (ajusta el factor si quieres)
  }

  /**
   * Devuelve la altura (en px) según la duración del turno.
   * Ejemplo: "08:00" a "10:30" => 150 si cada minuto es 1px.
   */
  getTurnoHeight(hora_inicio: string, hora_fin: string): number {
    const [h1, m1] = hora_inicio.split(':').map(Number);
    const [h2, m2] = hora_fin.split(':').map(Number);
    return ((h2 * 60 + (m2 || 0)) - (h1 * 60 + (m1 || 0)));
  }

}
