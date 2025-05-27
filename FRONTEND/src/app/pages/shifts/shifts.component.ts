import { Component, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgFor, DatePipe } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ShiftDialogComponent } from './shift-dialog/shift-dialog.component';

interface Shift {
  id: string;
  employee: string;
  time: string;
  type: 'morning' | 'afternoon' | 'night';
  startHour: number;
  endHour: number;
  task: string;
  date: Date;
}

interface CalendarDay {
  date: string;
  dayOfWeek: string;
  fullDate: Date;
  shifts: Shift[];
}

type CalendarView = 'day' | 'week' | 'month';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [NgClass, NgFor, DragDropModule, DatePipe],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {
  @ViewChild('dayDropList') dayDropList!: CdkDropList;

  calendarDays: CalendarDay[] = [];
  currentDate: Date = new Date();
  currentView: CalendarView = 'week';
  weekDays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  hours: number[] = Array.from({length: 48}, (_, i) => i * 0.5);

  private allShifts: Shift[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.generateCalendarDays();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private updateCalendarDays(): void {
    this.calendarDays.forEach(day => {
      const dateKey = this.getDateKey(day.fullDate);
      day.shifts = this.allShifts
        .filter(shift => this.getDateKey(shift.date) === dateKey)
        .map(shift => ({
          ...shift,
          date: new Date(day.fullDate)
        }));
    });
  }

  generateCalendarDays(): void {
    this.calendarDays = [];

    switch (this.currentView) {
      case 'week':
        this.generateWeekView();
        break;
      case 'month':
        this.generateMonthView();
        break;
      case 'day':
        this.generateDayView();
        break;
    }

    this.updateCalendarDays();
  }

  generateWeekView(): void {
    const currentDay = this.currentDate.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(this.currentDate);
    monday.setDate(monday.getDate() - diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      this.calendarDays.push({
        date: date.getDate().toString(),
        dayOfWeek: this.weekDays[i],
        fullDate: date,
        shifts: []
      });
    }
  }

  generateMonthView(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let firstDayOfWeek = firstDay.getDay() || 7;
    firstDayOfWeek = firstDayOfWeek === 1 ? 0 : firstDayOfWeek - 1;

    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push({
        date: '',
        dayOfWeek: this.weekDays[i],
        fullDate: new Date(),
        shifts: []
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);

      this.calendarDays.push({
        date: day.toString(),
        dayOfWeek: this.weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
        fullDate: date,
        shifts: []
      });
    }
  }

  generateDayView(): void {
    const date = new Date(this.currentDate);

    this.calendarDays = [{
      date: date.getDate().toString(),
      dayOfWeek: this.weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
      fullDate: date,
      shifts: []
    }];
  }

  getShiftsForHour(day: CalendarDay, hour: number): Shift[] {
    return day.shifts.filter(shift =>
      shift.startHour <= hour && shift.endHour > hour
    );
  }

  onDrop(event: CdkDragDrop<any>, targetDay: CalendarDay, targetHour: number): void {
    const shift = event.item.data;
    const duration = shift.endHour - shift.startHour;
    const newEndHour = Math.min(targetHour + duration, 24);

    // Crear el nuevo turno con la hora actualizada
    const newShift: Shift = {
      ...shift,
      time: `${this.formatHour(targetHour)} - ${this.formatHour(newEndHour)}`,
      type: this.getShiftType(targetHour),
      startHour: targetHour,
      endHour: newEndHour,
      date: new Date(targetDay.fullDate)
    };

    // Actualizar el array global
    this.allShifts = this.allShifts.map(s => s.id === shift.id ? newShift : s);

    // Forzar la actualización de la vista
    this.calendarDays = this.calendarDays.map(day => {
      if (this.getDateKey(day.fullDate) === this.getDateKey(targetDay.fullDate)) {
        return {
          ...day,
          shifts: day.shifts.map(s => s.id === shift.id ? newShift : s)
        };
      }
      return day;
    });
  }

  openShiftDialog(day: CalendarDay, hourOrShift: number | Shift): void {
    const isEdit = typeof hourOrShift !== 'number';
    const shift = isEdit ? hourOrShift as Shift : null;
    const hour = isEdit ? shift!.startHour : hourOrShift as number;

    const dialogRef = this.dialog.open(ShiftDialogComponent, {
      width: '500px',
      data: {
        date: new Date(day.fullDate),
        hour: hour,
        isEdit: isEdit,
        employee: shift?.employee || '',
        startTime: shift?.time.split(' - ')[0] || this.formatHour(hour),
        endTime: shift?.time.split(' - ')[1] || this.formatHour(hour + 0.5),
        task: shift?.task || '',
        existingShifts: this.getShiftsForDate(day.fullDate)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete && shift) {
          this.allShifts = this.allShifts.filter(s => s.id !== shift.id);
        } else {
          const [startHour] = result.startTime.split(':').map(Number);
          const [endHour] = result.endTime.split(':').map(Number);

          const newShift: Shift = {
            id: isEdit ? shift!.id : this.generateId(),
            employee: result.employee,
            time: `${result.startTime} - ${result.endTime}`,
            type: this.getShiftType(startHour),
            startHour: startHour,
            endHour: endHour,
            task: result.task,
            date: new Date(day.fullDate)
          };

          if (isEdit) {
            this.allShifts = this.allShifts.map(s => s.id === shift!.id ? newShift : s);
          } else {
            this.allShifts.push(newShift);
          }
        }

        this.updateCalendarDays();
      }
    });
  }

  private getShiftsForDate(date: Date): Shift[] {
    return this.allShifts.filter(shift =>
      this.getDateKey(shift.date) === this.getDateKey(date)
    );
  }

  previousPeriod(): void {
    switch (this.currentView) {
      case 'day':
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        break;
      case 'week':
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        break;
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        break;
    }
    this.generateCalendarDays();
  }

  nextPeriod(): void {
    switch (this.currentView) {
      case 'day':
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        break;
      case 'week':
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        break;
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        break;
    }
    this.generateCalendarDays();
  }

  changeView(view: CalendarView): void {
    this.currentView = view;
    this.generateCalendarDays();
  }

  getCurrentPeriodLabel(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };

    switch (this.currentView) {
      case 'week':
        const startDate = new Date(this.calendarDays[0].fullDate);
        const endDate = new Date(this.calendarDays[6].fullDate);
        return `${startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      case 'month':
        return this.currentDate.toLocaleDateString('es-ES', options);
      case 'day':
        return this.currentDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
    }
  }

  handleShiftClick(event: MouseEvent, day: CalendarDay, shift: Shift): void {
    event.preventDefault();
    event.stopPropagation();
    this.openShiftDialog(day, shift);
  }

  getShiftType(hour: number): 'morning' | 'afternoon' | 'night' {
    if (hour >= 6 && hour < 14) return 'morning';
    if (hour >= 14 && hour < 22) return 'afternoon';
    return 'night';
  }

  isHalfHour(hour: number): boolean {
    return hour % 1 !== 0;
  }

  formatHour(hour: number): string {
    const hours = Math.floor(hour);
    const minutes = hour % 1 === 0.5 ? '30' : '00';
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  setView(view: CalendarView): void {
    this.currentView = view;
    this.generateCalendarDays();
  }

  getConnectedLists(): string[] {
    return this.calendarDays.map(day =>
      this.hours.map(hour => `${day.fullDate.toISOString()}-${hour}`)
    ).flat();
  }
}
