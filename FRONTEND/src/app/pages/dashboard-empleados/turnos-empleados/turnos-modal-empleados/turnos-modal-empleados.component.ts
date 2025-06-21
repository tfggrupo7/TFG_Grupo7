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
import { EmpleadosService } from '../../../../core/services/empleados.service';
import { RolesService } from '../../../../core/services/roles.service';
import { IEmpleados } from '../../../../interfaces/iempleados.interfaces';
import { IRoles } from '../../../../interfaces/iroles.interfaces';

@Component({
  selector: 'app-turnos-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './turnos-modal-empleados.component.html',
  styleUrls: ['./turnos-modal-empleados.component.css']
})
export class TurnosModalEmpleadosComponent implements OnInit, OnChanges {
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
  @Output() close = new EventEmitter<void>();          // Cierre sin cambios
  @Output() create = new EventEmitter<ITurnos>();       // Creación de nuevo turno
  @Output() update = new EventEmitter<ITurnos>();       // Actualización de turno

  /** Formulario reactivo que representa el modelo del turno */
  shiftForm: FormGroup;
  /** Flag para distinguir entre modo creación y edición */
  isEditMode = false;

  employees: IEmpleados[] = [];
  roles: IRoles[] = [];

  constructor(private fb: FormBuilder, private empleadosService: EmpleadosService, private rolesService: RolesService) {
    // Construcción del formulario con validaciones mínimas
    this.shiftForm = this.fb.group({
      empleado_id: ['', Validators.required],
      roles_id: ['', Validators.required],
      fecha: ['', Validators.required],
      dia: ['', Validators.required],
      estado: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      duracion: [1],                    // Se rellena dinámicamente
      titulo: [''],
      color: ['bg-[#D4AF37]/90']      // Clase CSS tailwind‑like
    });
  }

  /* -----------------------------------------------------------------------
   * Ciclo de vida Angular
   * --------------------------------------------------------------------- */
  async ngOnInit() {
    // ① cargamos empleados y roles en paralelo
    await Promise.all([this.loadEmployees(), this.loadRoles()]);
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

  /**
   * Inicializa el formulario en modo edición o creación.
   * Si hay un turno para editar (`shiftToEdit`), rellena el formulario con sus datos.
   * Si no, prepara el formulario para crear un nuevo turno con valores por defecto.
   * También normaliza los formatos de fecha y hora.
   */
  private setFormForEdit() {
    if (this.shiftToEdit) {
      /* ----- Modo edición ----- */
      this.isEditMode = true;
      this.shiftForm.reset();// <-- Añade este reset para limpiar el formulario
      const patch = { ...this.shiftToEdit };
      // Normaliza fecha a 'YYYY-MM-DD'
      if (patch.fecha) {
        patch.fecha = this.toLocalDateString(patch.fecha);
      }

      // Normaliza horas a 'HH:mm'
      if (patch.hora_inicio) {
        patch.hora_inicio = patch.hora_inicio.slice(0, 5);
      }
      if (patch.hora_fin) {
        patch.hora_fin = patch.hora_fin.slice(0, 5);
      }

      this.shiftForm.patchValue(patch);
    } else {
      /* ----- Modo creación ----- */
      this.isEditMode = false;
      const fecha = this.currentWeekDates[this.selectedDayIndex] ?? '';
      const inicioH = this.selectedHour;
      const finH = inicioH + 1;
      this.shiftForm.reset({
        empleado_id: '',
        roles_id: '',
        dia: this.getDayName(this.selectedDayIndex),
        fecha,
        estado: 'pendiente',
        hora_inicio: `${inicioH.toString().padStart(2, '0')}:00`,
        hora_fin: `${finH.toString().padStart(2, '0')}:00`,
        duracion: 1,
        titulo: '',
        color: 'bg-[#D4AF37]/90'
      });
    }
    this.updateDuration();
  }

  /**
   * Descarga la lista de empleados desde el backend y la almacena en `employees`.
   * Si ocurre un error, lo muestra por consola.
   */
  private async loadEmployees() {
    try {
      this.employees = await this.empleadosService.getEmpleados();
    } catch (err) {
      console.error('Error cargando empleados', err);
    }
  }

  /**
   * Descarga la lista de roles desde el backend y la almacena en `roles`.
   * Si ocurre un error, lo muestra por consola.
   */
  private async loadRoles() {
    try {
      this.roles = await this.rolesService.getRoles();
    } catch (err) {
      console.error('Error cargando roles', err);
    }
  }

  /* -----------------------------------------------------------------------
     * Lógica auxiliar: duración del turno
     * --------------------------------------------------------------------- */
  /**
   * Calcula la duración del turno en horas decimales a partir de las horas de inicio y fin.
   * Actualiza el campo `duracion` del formulario.
   * Evita emitir eventos para no provocar bucles de actualización.
   */
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
  /**
   * Acción de borrado: emite el evento `delete` al padre, limpia el formulario y sale de modo edición.
   */
  onDelete() {
    this.delete.emit();      // Notifica al padre
    this.shiftForm.reset();  // Limpia el formulario
    this.isEditMode = false; // Regresa a creación
  }

  /**
   * Acción de cierre: limpia el formulario, sale de modo edición y emite el evento `close` al padre.
   */
  onClose() {
    this.shiftForm.reset();
    this.isEditMode = false;
    this.close.emit();
  }

  /**
   * Envía el formulario al padre, eligiendo entre crear o actualizar un turno.
   * 1. Valida el formulario.
   * 2. Prepara el objeto ITurnos con los datos del formulario.
   * 3. Emite el evento correspondiente (`create` o `update`).
   * 4. Limpia el formulario y sale de modo edición.
   */
  onSubmit(): void {
    // 1. Validación
    if (this.shiftForm.invalid) { return; }

    // 2. Copia de valores + coherencia con la semana visible
    const formValue = { ...this.shiftForm.value };
    const dayIndex = this.currentWeekDates.indexOf(formValue.fecha);

    if (dayIndex === -1) {
      alert('La fecha no pertenece a la semana visible');
      return;
    }

    formValue.dia = this.getDayName(dayIndex);

    // 3. Campo «hora» numérico derivado de hora_inicio (HH:mm)
    const horaNum = parseInt(formValue.hora_inicio.split(':')[0], 10);

    // 4. Validar duración y forzar valor por defecto si es null o <= 0
    if (!formValue.duracion || formValue.duracion <= 0) {
      alert('La duración del turno debe ser mayor que 0');
      formValue.duracion = 1; // Valor por defecto para evitar null
      // return; // Si quieres evitar guardar, descomenta esta línea
    }

    // 5. Construir ITurnos completo
    const turno: ITurnos = {
      ...formValue,
      hora: horaNum,
      id: this.shiftToEdit?.id ?? 0
    } as ITurnos;

    // 6. Enviar acción al padre
    this.isEditMode ? this.update.emit(turno) : this.create.emit(turno);

    // 7. Limpieza local
    this.shiftForm.reset();
    this.isEditMode = false;
  }

  /* -----------------------------------------------------------------------
     * Helpers
     * --------------------------------------------------------------------- */
  /**
   * Devuelve el nombre del día de la semana según el índice (0=Lunes).
   * Útil para mostrar en el formulario.
   */
  getDayName(index: number): string {
    return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][index];
  }

  /**
     * Array de opciones de hora en intervalos de 30 minutos (formato HH:mm).
     * Útil para selects desplegables de horas.
     */
  halfHourOptions: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  /**
   * Normaliza una fecha a formato local 'YYYY-MM-DD'.
   * Si la fecha ya está en ese formato, la devuelve tal cual.
   * Si es una cadena ISO, extrae solo la parte de la fecha.
   */
  /** Devuelve YYYY-MM-DD en horario local */
  private toLocalDateString(fecha: string): string {
    const d = new Date(fecha);
    // corrige el desfase: convierte la fecha UTC a “local 00:00”
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

}
