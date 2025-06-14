import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosModalComponent } from './turnos-modal/turnos-modal.component';

interface Shift {
  day: string;
  hour: number;
  duration: number;
  title: string;
  employeeName: string;
  role: string;
  date: string;
  status: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, TurnosModalComponent],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {
  @ViewChild(TurnosModalComponent) modalRef!: TurnosModalComponent;

  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  hours = Array.from({ length: 24 }, (_, i) => i);

  shifts: Shift[] = [];

  // Drag and drop
  draggedShift: Shift | null = null;

  // Modal state
  isModalOpen = false;
  selectedDayIndex = 0;
  selectedHour = 0;
  selectedShift: Shift | null = null;

  currentWeekDates: string[] = [];
ngOnInit() {
  this.setCurrentWeekDates();
}

setCurrentWeekDates() {
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
  this.currentWeekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(firstDayOfWeek);
    d.setDate(firstDayOfWeek.getDate() + i);
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  });
}


  openModal(dayIndex: number, hour: number) {
  this.selectedDayIndex = dayIndex;
  this.selectedHour = hour;
  this.selectedShift = null;
  this.isModalOpen = true;
  setTimeout(() => {
    // Si usas ViewChild para el modal:
    this.modalRef?.shiftForm.patchValue({
      date: this.currentWeekDates[dayIndex],
      startTime: `${hour.toString().padStart(2, '0')}:00`
    });
  });
}

  closeModal() {
    this.isModalOpen = false;
    this.selectedShift = null;
  }

    createShift(shiftData: {
    employeeName: string;
    role: string;
    date: string;
    status: string;
    startTime: string;
    endTime: string;
    dayIndex: number;
    hour: number;
  }) {
    const newShift: Shift = {
      day: this.daysOfWeek[shiftData.dayIndex],
      hour: shiftData.hour,
      title: `${shiftData.employeeName} - ${shiftData.role}`,
      duration: this.calculateDuration(shiftData.startTime, shiftData.endTime),
      employeeName: shiftData.employeeName,
      role: shiftData.role,
      date: this.currentWeekDates[shiftData.dayIndex],
      status: shiftData.status,
      startTime: shiftData.startTime,
      endTime: shiftData.endTime
    };
    this.shifts.push(newShift);
    this.closeModal();
  }
  updateShift(shiftData: {
    employeeName: string;
    role: string;
    date: string;
    status: string;
    startTime: string;
    endTime: string;
  }) {
    if (this.selectedShift) {
      const index = this.shifts.findIndex(s => s === this.selectedShift);
      if (index !== -1) {
        this.shifts[index] = {
          ...this.selectedShift,
          title: `${shiftData.employeeName} - ${shiftData.role}`,
          duration: this.calculateDuration(shiftData.startTime, shiftData.endTime),
          employeeName: shiftData.employeeName,
          role: shiftData.role,
          date: shiftData.date,
          status: shiftData.status,
          startTime: shiftData.startTime,
          endTime: shiftData.endTime
        };
      }
    }
    this.closeModal();
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  onDragStart(shift: Shift) {
    this.draggedShift = shift;
  }

  onShiftClick(shift: Shift) {
    this.selectedShift = shift;
    this.selectedDayIndex = this.daysOfWeek.indexOf(shift.day);
    this.selectedHour = shift.hour;
    this.isModalOpen = true;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }


  onDrop(event: DragEvent, dayIndex: number, hour: number) {
  event.preventDefault();
  if (this.draggedShift) {
    this.draggedShift.day = this.daysOfWeek[dayIndex];
    this.draggedShift.hour = hour;
    this.draggedShift.date = this.currentWeekDates[dayIndex]; // <-- Actualiza la fecha

    const pad = (n: number) => n.toString().padStart(2, '0');
    this.draggedShift.startTime = `${pad(hour)}:00`;
    const endHour = hour + this.draggedShift.duration;
    this.draggedShift.endTime = `${pad(endHour)}:00`;

    this.draggedShift = null;
  }
}
deleteShift() {
  if (this.selectedShift) {
    this.shifts = this.shifts.filter(shift => shift !== this.selectedShift);
    this.selectedShift = null;
    this.isModalOpen = false;
  }
}

get todayShifts(): Shift[] {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  return this.shifts.filter(shift => shift.date === todayStr);
}

get todayFormatted(): string {
  const hoy = new Date();
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${meses[hoy.getMonth()]} ${hoy.getFullYear()}`;
}

get activeShiftsCount(): number {
  return this.shifts.filter(shift => shift.status?.toLowerCase() === 'confirmado').length;
}

get pendingShiftsCount(): number {
  return this.shifts.filter(shift => shift.status?.toLowerCase() === 'pendiente').length;
}

get completedShiftsCount(): number {

  const weekDates = this.currentWeekDates;
  return this.shifts.filter(
    shift =>
      shift.status?.toLowerCase() === 'completado' &&
      weekDates.includes(shift.date)
  ).length;
}
get todayStaffCount(): number {
  const today = new Date().toISOString().slice(0, 10);
  const empleados = this.shifts
    .filter(shift => shift.date === today && shift.employeeName)
    .map(shift => shift.employeeName);
  // Filtra nombres únicos
  return Array.from(new Set(empleados)).length;
}

}
