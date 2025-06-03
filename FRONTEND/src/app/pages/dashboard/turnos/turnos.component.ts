import { Component } from '@angular/core';
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
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  hours = Array.from({ length: 24 }, (_, i) => i); // 0 a 23

  // Ejemplo de turnos
  shifts: Shift[] = [
    { day: 'Lunes', hour: 8, duration: 4, title: 'Turno A', employeeName: '', role: '', date: '', status: '', startTime: '8:00', endTime: '12:00' }, // Lunes 8:00-12:00
    // Puedes añadir más turnos aquí
  ];

  // Drag and drop
  draggedShift: Shift | null = null;

  // Modal state
  isModalOpen = false;
  selectedDayIndex = 0;
  selectedHour = 0;
  selectedShift: Shift | null = null;

  openModal(dayIndex: number, hour: number) {
    this.selectedDayIndex = dayIndex;
    this.selectedHour = hour;
    this.selectedShift = null;
    this.isModalOpen = true;
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
  }) {
    const newShift: Shift = {
      day: this.daysOfWeek[this.selectedDayIndex],
      hour: this.selectedHour,
      title: `${shiftData.employeeName} - ${shiftData.role}`,
      duration: this.calculateDuration(shiftData.startTime, shiftData.endTime),
      employeeName: shiftData.employeeName,
      role: shiftData.role,
      date: shiftData.date,
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
      this.draggedShift = null;
    }
  }
}
