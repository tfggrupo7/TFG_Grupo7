/**
 * Componente **TurnosModalComponent**
 * --------------------------------------------------
 * Diálogo (modal) para crear o editar un turno.
 * Sólo se añaden comentarios descriptivos; el flujo de lógica
 * permanece igual a tu versión original.
 */

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
  /**
   * Propiedades de entrada : controlan visibilidad y contexto del modal
   * --------------------------------------------------
   */
  @Input() isOpen = false;                // ¿Está abierto el diálogo?
  @Input() selectedDayIndex = 0;          // Índice del día clicado (0 = lunes)
  @Input() selectedHour = 0;              // Hora seleccionada para turno nuevo
  @Input() currentWeekDates: string[] = [];// Array ISO‑date de la semana
  @Input() shiftToEdit: ITurnos | null = null; // Turno en edición, null = creación

  /**
   * Eventos de salida : comunican acciones al componente padre
   * --------------------------------------------------
   */
  @Output() delete = new EventEmitter<void>();          // Solicitud de borrado
  @Output() close  = new EventEmitter<void>();          // Cierre sin cambios
  @Output() create = new EventEmitter<ITurnos>();       // Creación de nuevo turno
  @Output() update = new EventEmitter<ITurnos>();       // Actualización de turno

  /** Formulario reactivo que representa el modelo del turno */
  shiftForm: FormGroup;
  /** Flag para distinguir entre modo creación y edición */
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    // Construcción del formulario con validaciones mínimas
    this.shiftForm = this.fb.group({
      empleado_id : ['', Validators.required],
      roles_id    : ['', Validators.required],
      fecha       : ['', Validators.required],
      dia         : ['', Validators.required],
      estado      : ['', Validators.required],
      hora_inicio : ['', Validators.required],
      hora_fin    : ['', Validators.required],
      duracion    : [1],                    // Se rellena dinámicamente
      titulo      : [''],
      color       : ['bg-[#D4AF37]/90']      // Clase CSS tailwind‑like
    });
  }

  /* -----------------------------------------------------------------------
   * Ciclo de vida Angular
   * --------------------------------------------------------------------- */
  ngOnInit() {
    this.setFormForEdit(); // Configura el formulario según «isEditMode»

    // Recalcular duración cuando cambian las horas de inicio/fin
    this.shiftForm.get('hora_inicio')?.valueChanges.subscribe(() => this.updateDuration());
    this.shiftForm.get('hora_fin')?.valueChanges.subscribe(() => this.updateDuration());
  }

  ngOnChanges(changes: SimpleChanges) {
    // Cuando cambian el turno a editar o la apertura del modal → reconstruir el formulario
    if (changes['shiftToEdit'] || changes['isOpen']) {
      this.setFormForEdit();
    }
  }

  /* -----------------------------------------------------------------------
   * Configuración inicial del formulario
   * --------------------------------------------------------------------- */
  private setFormForEdit() {
    if (this.shiftToEdit) {
      /* ----- Modo edición ----- */
      this.isEditMode = true;
      this.shiftForm.patchValue(this.shiftToEdit); // Precargar datos
    } else {
      /* ----- Modo creación ----- */
      this.isEditMode = false;

      const fecha   = this.currentWeekDates[this.selectedDayIndex] ?? '';
      const inicioH = this.selectedHour;
      const finH    = inicioH + 1;

      // Valores por defecto para un nuevo turno de 1 hora
      this.shiftForm.reset({
        empleado_id : '',
        roles_id    : '',
        dia         : this.getDayName(this.selectedDayIndex),
        fecha,
        estado      : 'pendiente',
        hora_inicio : `${inicioH.toString().padStart(2, '0')}:00`,
        hora_fin    : `${finH.toString().padStart(2, '0')}:00`,
        duracion    : 1,
        titulo      : '',
        color       : 'bg-[#D4AF37]/90'
      });
    }

    // Establecemos la duración coherente tras inicializar
    this.updateDuration();
  }

  /* -----------------------------------------------------------------------
   * Lógica auxiliar: duración del turno
   * --------------------------------------------------------------------- */
  private updateDuration() {
    const ini = this.shiftForm.value.hora_inicio;
    const fin = this.shiftForm.value.hora_fin;
    if (!ini || !fin) return;

    const [ih, im] = ini.split(':').map(Number);
    const [fh, fm] = fin.split(':').map(Number);
    const dur = (fh + fm / 60) - (ih + im / 60); // Horas decimales

    // Evitamos emitir otro change (emitEvent false) para no causar bucles
    this.shiftForm.get('duracion')!.setValue(dur > 0 ? dur : null, { emitEvent: false });
  }

  /* -----------------------------------------------------------------------
   * Acciones del usuario (botones dentro del modal)
   * --------------------------------------------------------------------- */
  onDelete() {
    this.delete.emit();      // Notifica al padre
    this.shiftForm.reset();  // Limpia el formulario
    this.isEditMode = false; // Regresa a creación
  }

  onClose() {
    this.shiftForm.reset();
    this.isEditMode = false;
    this.close.emit();
  }

  /**
   * Envía el formulario al padre, eligiendo «create» o «update».
   * 1) Verifica validez. 2) Prepara objeto ITurnos. 3) Emitter.
   */
  onSubmit(): void {
    // 1. Validación
    if (this.shiftForm.invalid) { return; }

    // 2. Copia de valores + coherencia con la semana visible
    const formValue = { ...this.shiftForm.value };
    const dayIndex  = this.currentWeekDates.indexOf(formValue.fecha);

    if (dayIndex === -1) {
      alert('La fecha no pertenece a la semana visible');
      return;
    }

    formValue.dia = this.getDayName(dayIndex);

    // 3. Campo «hora» numérico derivado de hora_inicio (HH:mm)
    const horaNum = parseInt(formValue.hora_inicio.split(':')[0], 10);

    // 4. Construir ITurnos completo
    const turno: ITurnos = {
      ...formValue,
      hora: horaNum,
      id  : this.shiftToEdit?.id ?? 0          // id=0 para creaciones nuevas
    } as ITurnos;

    // 5. Enviar acción al padre
    this.isEditMode ? this.update.emit(turno) : this.create.emit(turno);

    // 6. Limpieza local
    this.shiftForm.reset();
    this.isEditMode = false;
  }

  /* -----------------------------------------------------------------------
   * Helpers
   * --------------------------------------------------------------------- */
  getDayName(index: number): string {
    return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][index];
  }

  /** Lista HH:mm cada 30 minutos ‑ útil para selects desplegables */
  halfHourOptions: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });
}
