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
      dia: ['', Validators.required],
      estado: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      duracion: [1],
      titulo: [''],
      color: ['bg-[#D4AF37]/90']
    });
  }

  ngOnInit() {
    this.setFormForEdit();

    // recalcular duración cuando cambian las horas
    this.shiftForm.get('hora_inicio')?.valueChanges.subscribe(() => this.updateDuration());
    this.shiftForm.get('hora_fin')?.valueChanges.subscribe(() => this.updateDuration());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shiftToEdit'] || changes['isOpen']) {
      this.setFormForEdit();
    }
  }

  private setFormForEdit() {
    if (this.shiftToEdit) {
      // modo edición
      this.isEditMode = true;
      this.shiftForm.patchValue(this.shiftToEdit);
    } else {
      // modo creación: rellenamos campos clave
      this.isEditMode = false;

      const fecha   = this.currentWeekDates[this.selectedDayIndex] ?? '';
      const inicioH = this.selectedHour;
      const finH    = inicioH + 1;

      this.shiftForm.reset({
        empleado_id : '',
        roles_id    : '',
        dia: this.getDayName(this.selectedDayIndex),
        fecha,
        estado      : 'pendiente',
        hora_inicio : `${inicioH.toString().padStart(2, '0')}:00`,
        hora_fin    : `${finH.toString().padStart(2, '0')}:00`,
        duracion    : 1,
        titulo      : '',
        color       : 'bg-[#D4AF37]/90'
      });
    }

    // aseguramos duración coherente desde el principio
    this.updateDuration();
  }

   /* ---------- Lógica de duración ---------- */
  private updateDuration() {
    const ini = this.shiftForm.value.hora_inicio;
    const fin = this.shiftForm.value.hora_fin;
    if (!ini || !fin) return;

    const [ih, im] = ini.split(':').map(Number);
    const [fh, fm] = fin.split(':').map(Number);
    const dur = (fh + fm / 60) - (ih + im / 60);

    this.shiftForm.get('duracion')!.setValue(dur > 0 ? dur : null, { emitEvent: false });
  }

  /* ---------- Acciones ---------- */
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

  onSubmit(): void {
  // 1. El formulario debe ser válido
  if (this.shiftForm.invalid) { return; }

  // 2. Copiamos los valores y recalculamos el día por si la fecha cambió
      const formValue = { ...this.shiftForm.value };
  const dayIndex  = this.currentWeekDates.indexOf(formValue.fecha);

      if (dayIndex === -1) {
    alert('La fecha no pertenece a la semana visible');
        return;
      }

  formValue.dia = this.getDayName(dayIndex);      // «Lunes», «Martes», …

  // 3. Hora numérica auxiliar (p. ej. 14 para «14:00»)
  const horaNum = parseInt(formValue.hora_inicio.split(':')[0], 10);

  // 4. Construimos el objeto ITurnos
      const turno: ITurnos = {
        ...formValue,
    hora: horaNum,
    id  : this.shiftToEdit?.id ?? 0
      };

  // 5. Emitimos la acción adecuada
  this.isEditMode ? this.update.emit(turno) : this.create.emit(turno);

  // 6. Reset y cierre local
      this.shiftForm.reset();
      this.isEditMode = false;
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