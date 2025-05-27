import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Shift {
  employee: string;
  time: string;
  type: 'morning' | 'afternoon' | 'night';
  startHour: number;
  endHour: number;
  task: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private shifts = new BehaviorSubject<Shift[]>([]);

  constructor() {
    // Inicializar con algunos turnos de ejemplo
    const today = new Date();
    const shifts: Shift[] = [
      {
        employee: 'Juan Pérez',
        time: '08:00 - 16:00',
        type: 'morning',
        startHour: 8,
        endHour: 16,
        task: 'Atención al cliente',
        date: new Date(today)
      },
      {
        employee: 'María Gómez',
        time: '16:00 - 00:00',
        type: 'afternoon',
        startHour: 16,
        endHour: 24,
        task: 'Gestión de inventario',
        date: new Date(today)
      }
    ];
    this.shifts.next(shifts);
  }

  getShifts(): Observable<Shift[]> {
    return this.shifts.asObservable();
  }

  getShiftsForDate(date: Date): Shift[] {
    const dateKey = this.getDateKey(date);
    return this.shifts.value.filter(shift =>
      this.getDateKey(shift.date) === dateKey
    ).map(shift => ({
      ...shift,
      date: new Date(date) // Asegurar que la fecha es una nueva instancia
    }));
  }

  addShift(shift: Shift): void {
    const currentShifts = this.shifts.value;
    const newShift = {
      ...shift,
      date: new Date(shift.date) // Asegurar que la fecha es una nueva instancia
    };
    this.shifts.next([...currentShifts, newShift]);
  }

  updateShift(oldShift: Shift, newShift: Shift): void {
    const currentShifts = this.shifts.value;
    const index = currentShifts.findIndex(s =>
      this.getDateKey(s.date) === this.getDateKey(oldShift.date) &&
      s.startHour === oldShift.startHour &&
      s.employee === oldShift.employee
    );

    if (index !== -1) {
      const updatedShift = {
        ...newShift,
        date: new Date(newShift.date) // Asegurar que la fecha es una nueva instancia
      };
      currentShifts[index] = updatedShift;
      this.shifts.next([...currentShifts]);
    }
  }

  removeShift(shift: Shift): void {
    const currentShifts = this.shifts.value;
    const filteredShifts = currentShifts.filter(s =>
      this.getDateKey(s.date) !== this.getDateKey(shift.date) ||
      s.startHour !== shift.startHour ||
      s.employee !== shift.employee
    );
    this.shifts.next(filteredShifts);
  }

  moveShift(shift: Shift, newDate: Date, newStartHour: number): void {
    const duration = shift.endHour - shift.startHour;
    const newEndHour = Math.min(newStartHour + duration, 24);

    const newShift: Shift = {
      employee: shift.employee,
      task: shift.task,
      date: new Date(newDate), // Asegurar que la fecha es una nueva instancia
      startHour: newStartHour,
      endHour: newEndHour,
      time: `${this.formatHour(newStartHour)} - ${this.formatHour(newEndHour)}`,
      type: this.getShiftType(newStartHour)
    };

    // Primero añadir el nuevo turno
    this.addShift(newShift);
    // Luego eliminar el turno original
    this.removeShift(shift);
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  private getShiftType(hour: number): 'morning' | 'afternoon' | 'night' {
    if (hour >= 6 && hour < 14) return 'morning';
    if (hour >= 14 && hour < 22) return 'afternoon';
    return 'night';
  }
}
