import { Component, effect, EventEmitter, Input, input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IIngredientes } from '../../../../interfaces/iingredientes.interfaces';

@Component({
  selector: 'app-inventario-form-empleados',
  imports: [ReactiveFormsModule],
  templateUrl: './inventario-form-empleados.component.html',
  styleUrl: './inventario-form-empleados.component.css'
})
export class InventarioFormEmpleadosComponent {

  @Output() sendData = new EventEmitter<IIngredientes>();
  @Output() closeEvent = new EventEmitter<any>();
  @Input() ingrediente: IIngredientes | null = null;

  ingredientForm: FormGroup  = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required]),
      proveedor: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
      alergenos: new FormControl('', [Validators.required]),
      unidad: new FormControl('', [Validators.required])
  })

  btnDescription: string = 'Añadir'

  constructor(){}

  updateForm(ingrediente: IIngredientes) {
    this.ingredientForm.patchValue(ingrediente)
  }

  getDataForm() {
    if (this.ingredientForm.valid) {
      const data = {...this.ingredientForm.value, id: this.ingrediente?.id};
      this.sendData.emit(data);
    }
  }

  cerrarModal(){
    this.closeEvent.emit();
  }

  ngOnInit() {
    if(this.ingrediente?.id){
      this.btnDescription = 'Actualizar'
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ingrediente'] && changes['ingrediente'].currentValue) {
      this.updateForm(changes['ingrediente'].currentValue);
    }
  }
}
