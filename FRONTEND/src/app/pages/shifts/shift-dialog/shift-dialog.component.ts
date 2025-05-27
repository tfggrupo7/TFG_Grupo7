import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface ShiftDialogData {
  date: Date;
  hour: number;
  isEdit?: boolean;
  employee?: string;
  startTime?: string;
  endTime?: string;
  task?: string;
  existingShifts?: any[];
}

@Component({
  selector: 'app-shift-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './shift-dialog.component.html',
  styleUrls: ['./shift-dialog.component.css']
})
export class ShiftDialogComponent implements OnInit {
  availableEmployees: string[] = [];
  allEmployees: string[] = [
    'Juan Pérez',
    'María Gómez',
    'Carlos Rodríguez',
    'Ana Martínez',
    'Luis Sánchez',
    'Laura Fernández',
    'Pedro García',
    'Sofía López'
  ];

  constructor(
    public dialogRef: MatDialogRef<ShiftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShiftDialogData
  ) {
    // Inicializar con la hora seleccionada si no es edición
    if (!this.data.isEdit) {
      const hour = this.data.hour.toString().padStart(2, '0');
      this.data.startTime = `${hour}:00`;
      this.data.endTime = `${(this.data.hour + 1).toString().padStart(2, '0')}:00`;
    }
  }

  ngOnInit() {
    this.calculateAvailableEmployees();
  }

  calculateAvailableEmployees() {
    if (!this.data.existingShifts) {
      this.availableEmployees = this.allEmployees;
      return;
    }

    // Calcular horas trabajadas por empleado
    const employeeHours = new Map<string, number>();
    this.allEmployees.forEach(emp => employeeHours.set(emp, 0));

    // Calcular horas de los turnos existentes
    this.data.existingShifts.forEach(shift => {
      if (shift.employee) {
        const hours = shift.endHour - shift.startHour;
        employeeHours.set(shift.employee, (employeeHours.get(shift.employee) || 0) + hours);
      }
    });

    // Si estamos editando un turno existente, restar sus horas
    if (this.data.employee && this.data.startTime && this.data.endTime) {
      const [startHour] = this.data.startTime.split(':').map(Number);
      const [endHour] = this.data.endTime.split(':').map(Number);
      const currentHours = endHour - startHour;
      const currentTotal = employeeHours.get(this.data.employee) || 0;
      employeeHours.set(this.data.employee, Math.max(0, currentTotal - currentHours));
    }

    // Filtrar empleados con menos de 8 horas
    this.availableEmployees = this.allEmployees.filter(emp => {
      const currentHours = employeeHours.get(emp) || 0;
      return currentHours < 8;
    });
  }

  getHours(): number[] {
    // Generar slots de 30 minutos
    return Array.from({length: 48}, (_, i) => i * 0.5);
  }

  formatHour(hour: number): string {
    const hours = Math.floor(hour);
    const minutes = hour % 1 === 0.5 ? '30' : '00';
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close({ delete: true });
  }

  onSubmit(): void {
    if (this.data.startTime && this.data.endTime && this.data.task) {
      this.dialogRef.close({
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        task: this.data.task,
        employee: this.data.employee,
        date: this.data.date
      });
    }
  }
}
