import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IIngredientes } from '../../../../interfaces/iingredientes.interfaces';

@Component({
  selector: 'app-inventario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './inventario-form.component.html',
  styleUrl: './inventario-form.component.css'
})
export class InventarioFormComponent {

  @Output() sendData = new EventEmitter<IIngredientes>();
  @Output() closeEvent = new EventEmitter<any>();
  @Input() ingrediente: IIngredientes | null = null;

  ingredientForm: FormGroup  = new FormGroup({
      id: new FormControl(null), // Añadido para edición
      nombre: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      cantidad: new FormControl(0, [Validators.required, Validators.min(0)]),
      proveedor: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
      alergenos: new FormControl('', [Validators.required]),
      unidad: new FormControl('', [Validators.required])
  })

  btnDescription: string = 'Añadir'

  constructor(){}

  updateForm(ingrediente: IIngredientes) {
    this.ingredientForm.patchValue(ingrediente)
    if (ingrediente.id) {
      this.ingredientForm.get('id')?.setValue(ingrediente.id);
    }
  }

  getDataForm() {
    if (this.ingredientForm.valid) {
      const data = {...this.ingredientForm.value};
      this.sendData.emit(data);
    }
  }

  cerrarModal(){
    this.closeEvent.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ingrediente']) {
      const current = changes['ingrediente'].currentValue;
      if (current) {
        this.updateForm(current);
        this.btnDescription = 'Actualizar';
      } else {
        this.ingredientForm.reset();
        this.btnDescription = 'Añadir';
      }
    }
  }
}
