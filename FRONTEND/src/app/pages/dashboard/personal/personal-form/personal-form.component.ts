import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IEmpleados } from '../../../../interfaces/iempleados.interfaces';

@Component({
  selector: 'app-personal-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal-form.component.html',
  styleUrls: ['./personal-form.component.css']
})
export class PersonalFormComponent {
  @Input() empleado: IEmpleados | null = null;
  @Output() sendData = new EventEmitter<IEmpleados>();
  @Output() closeEvent = new EventEmitter<any>();

  empleadoForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    rol_id: new FormControl(3, Validators.required),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    fecha_inicio: new FormControl('', Validators.required),
    salario: new FormControl('', Validators.required),
    usuario_id: new FormControl(null),
    activo: new FormControl('Activo', Validators.required),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['empleado']) {
      const current = changes['empleado'].currentValue;
      if (current) {
        this.empleadoForm.patchValue(current);
        if (current.id) {
          this.empleadoForm.get('id')?.setValue(current.id);
        }
      } else {
        this.empleadoForm.reset({
          id: null,
          nombre: '',
          apellidos: '',
          rol_id: 3,
          telefono: '',
          email: '',
          fecha_inicio: '',
          salario: '',
          usuario_id: null,
          activo: 'Activo',
        });
      }
    }
  }

  getDataForm() {
    if (this.empleadoForm.valid) {
      const data = { ...this.empleadoForm.value };
      this.sendData.emit(data);
    }
  }

  cerrarModal() {
    this.closeEvent.emit();
  }
}
