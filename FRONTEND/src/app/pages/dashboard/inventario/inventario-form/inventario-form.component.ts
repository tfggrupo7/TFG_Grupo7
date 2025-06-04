import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './inventario-form.component.html',
  styleUrl: './inventario-form.component.css'
})
export class InventarioFormComponent {

  productForm: FormGroup  = new FormGroup({},[]);

  constructor(){
    this.productForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required]),
      proveedor: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required])
    })
  }


  getDataForm() {

  }

  cerrarModal(){}
}
