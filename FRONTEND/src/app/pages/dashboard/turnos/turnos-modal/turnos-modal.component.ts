import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
  selector: 'app-turnos-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './turnos-modal.component.html',
  styleUrls: ['./turnos-modal.component.css']
})
export class TurnosModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() selectedDay = '';
  @Input() selectedHour = 0;
  @Input() shiftToEdit: Shift | null = null;
  @Input() selectedDayIndex = 0
  @Input() currentWeekDates: string[] = [];
  @Output() delete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<{
  employeeName: string;
  role: string;
  date: string;
  status: string;
  startTime: string;
  endTime: string;
  dayIndex: number;
  hour: number;
}>();
@Output() update = new EventEmitter<{
  employeeName: string;
  role: string;
  date: string;
  status: string;
  startTime: string;
  endTime: string;
  dayIndex: number;
  hour: number;
}>();

  shiftForm: FormGroup;
  isEditMode = false;

  employees = [
    { value: 'juan', label: 'Juan Pérez' },
    { value: 'maria', label: 'María García' },
    { value: 'carlos', label: 'Carlos López' }
  ];

  roles = [
    { value: 'cocinero', label: 'Cocinero' },
    { value: 'camarero', label: 'Camarero' },
    { value: 'recepcionista', label: 'Recepcionista' }
  ];

  statuses = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'completado', label: 'Completado' }
  ];

  constructor(private fb: FormBuilder) {
    this.shiftForm = this.fb.group({
      employeeName: ['', Validators.required],
      role: ['', Validators.required],
      date: ['', Validators.required],
      status: ['pendiente', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.setFormForEdit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['shiftToEdit']) {
      this.setFormForEdit();
    }
  }

  onDelete() {
  this.delete.emit();
  this.shiftForm.reset();
  this.isEditMode = false;
}


  setFormForEdit() {
    if (this.shiftToEdit) {
      this.isEditMode = true;
      this.shiftForm.patchValue({
        employeeName: this.shiftToEdit.employeeName,
        role: this.shiftToEdit.role,
        date: this.shiftToEdit.date,
        status: this.shiftToEdit.status,
        startTime: this.shiftToEdit.startTime,
        endTime: this.shiftToEdit.endTime
      });
    } else {
      this.isEditMode = false;
      this.shiftForm.reset();
    }
  }


  onSubmit() {
  if (this.shiftForm.valid) {
    const formValue = { ...this.shiftForm.value };

    // Calcular hour a partir de startTime
    const hour = parseInt(formValue.startTime.split(':')[0], 10);

    // Calcular dayIndex a partir de la fecha seleccionada
    let dayIndex = 0;
    if (this.currentWeekDates && Array.isArray(this.currentWeekDates)) {
      dayIndex = this.currentWeekDates.indexOf(formValue.date);
    }
    if (dayIndex === -1) {
      alert('La fecha seleccionada no pertenece a la semana actual.');
      return;
    }

    if (this.isEditMode) {
      this.update.emit({ ...formValue, dayIndex, hour });
    } else {
      this.create.emit({ ...formValue, dayIndex, hour });
    }
    this.shiftForm.reset();
    this.isEditMode = false;
  }
}

  onClose() {
    this.shiftForm.reset();
    this.isEditMode = false;
    this.close.emit();
  }
}
