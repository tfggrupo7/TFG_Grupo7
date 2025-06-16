import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../../core/services/turnos.service';
import { ITurnos } from '../../../interfaces/iturnos.interfaces';
import { TurnosModalComponent } from './turnos-modal/turnos-modal.component';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, TurnosModalComponent],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
})
export class TurnosComponent implements OnInit {
  @ViewChild(TurnosModalComponent) modalRef!: TurnosModalComponent;

  turnos: ITurnos[] = [];
  currentWeekDates: string[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i);
  selectedDayIndex = 0;
  selectedHour = 0;
  selectedTurno: ITurnos | null = null;
  isModalOpen = false;

  constructor(private turnosService: TurnosService) {}

  async ngOnInit() {
    this.setCurrentWeekDates();
    await this.cargarTurnos();
  }

  async cargarTurnos() {
    try {
      const tokenEnStorage = localStorage.getItem('token');

      const res = await this.turnosService.getTurnos();
      this.turnos = res;
    } catch (error) {
      console.error('Error cargando turnos:', error);
    }
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
    return `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${
      meses[hoy.getMonth()]
    } ${hoy.getFullYear()}`;
  }

  setCurrentWeekDates() {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    this.currentWeekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(firstDayOfWeek);
      d.setDate(firstDayOfWeek.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  }

  openModal(dayIndex: number, hour: number, turno?: ITurnos) {
    this.selectedDayIndex = dayIndex;
    this.selectedHour = hour;
    this.selectedTurno = turno ?? null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTurno = null;
  }

  async createTurno(turno: ITurnos) {
    console.log('Creating turno:', turno);
    await this.turnosService.createTurno(turno);
    await this.cargarTurnos();
    this.closeModal();
  }

  async updateTurno(turno: ITurnos) {
    if (!turno.id) return;
    await this.turnosService.updateTurno(turno.id, turno);
    await this.cargarTurnos();
    this.closeModal();
  }

  async deleteTurno() {
    if (!this.selectedTurno?.id) return;
    await this.turnosService.deleteTurno(this.selectedTurno.id);
    await this.cargarTurnos();
    this.closeModal();
  }

  get todayStr(): string {
    return new Date().toISOString().slice(0, 10);
  }

  get todayTurnos(): ITurnos[] {
    return this.turnos.filter(t => t.fecha === this.todayStr);
  }

  get todayStaffCount(): number {
    return new Set(this.todayTurnos.map(t => t.empleado_id)).size;
  }

  get activeShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'confirmado').length;
  }

  get pendingShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'pendiente').length;
  }

  get completedShiftsCount(): number {
    return this.turnos.filter((t) => t.estado.toLowerCase() === 'completado').length;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDragStart(turno: ITurnos) {
    this.selectedTurno = turno;
  }

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

  onTurnoClick(turno: ITurnos) {
    const dayIndex = this.currentWeekDates.indexOf(turno.fecha);
    this.openModal(dayIndex, turno.hora, turno);
  }
}