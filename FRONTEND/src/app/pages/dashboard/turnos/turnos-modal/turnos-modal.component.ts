import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ITurnos } from '../../../../interfaces/iturnos.interfaces';

@Component({
  selector: 'app-turnos-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './turnos-modal.component.html',
  styleUrls: ['./turnos-modal.component.css']
})
export class TurnosModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() selectedDayIndex = 0;
  @Input() selectedHour = 0;
  @Input() currentWeekDates: string[] = [];
  @Input() shiftToEdit: ITurnos | null = null;

  @Output() delete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<ITurnos>();
  @Output() update = new EventEmitter<ITurnos>();

  shiftForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.shiftForm = this.fb.group({
      empleado_id: ['', Validators.required],
      roles_id: ['', Validators.required],
      fecha: ['', Validators.required],
      estado: ['pendiente', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      duracion: [1, Validators.required],
      titulo: [''],
      color: ['bg-[#D4AF37]/90']
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

  setFormForEdit() {
    if (this.shiftToEdit) {
      this.isEditMode = true;
      this.shiftForm.patchValue(this.shiftToEdit);
    } else {
      this.isEditMode = false;
      this.shiftForm.reset({ estado: 'pendiente', color: 'bg-[#D4AF37]/90' });
    }
  }

  onDelete() {
    this.delete.emit();
    this.shiftForm.reset();
    this.isEditMode = false;
  }

  onClose() {
    this.shiftForm.reset();
    this.isEditMode = false;
    this.close.emit();
  }

  onSubmit() {
    if (this.shiftForm.valid) {
      const formValue = { ...this.shiftForm.value };
      const hora = parseInt(formValue.hora_inicio.split(':')[0], 10);
      const dayIndex = this.currentWeekDates.indexOf(formValue.fecha);
      if (dayIndex === -1) {
        alert('La fecha no pertenece a la semana actual.');
        return;
      }

      const turno: ITurnos = {
        ...formValue,
        dia: this.getDayName(dayIndex),
        hora,
        id: this.shiftToEdit?.id ?? 0
      };

      if (this.isEditMode) {
        this.update.emit(turno);
      } else {
        this.create.emit(turno);
      }

      this.shiftForm.reset();
      this.isEditMode = false;
    }
  }

  getDayName(index: number): string {
    return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][index];
  }

  halfHourOptions: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });
}
