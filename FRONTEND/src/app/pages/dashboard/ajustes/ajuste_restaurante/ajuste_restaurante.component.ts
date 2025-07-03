import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajuste-restaurante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajuste_restaurante.component.html',
  styleUrls: ['./ajuste_restaurante.component.css']
})
export class AjusteRestauranteComponent implements OnInit {
  restaurantForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.restaurantForm = this.fb.group({
      restaurantName: ['Restaurante El Olivo', [Validators.required]],
      cuisineType: ['Mediterránea', [Validators.required]],
      address: ['Calle Mayor 123, Madrid, España', [Validators.required]],
      phone: ['+34 912 345 678', [Validators.required, Validators.pattern('^[+]?[0-9\\s-]{9,}$')]],
      email: ['info@elolivo.com', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Aquí podrías cargar los datos del restaurante desde un servicio
    this.loadRestaurantData();
  }

  loadRestaurantData(): void {
    // Simulación de carga de datos
    // En una aplicación real, esto vendría de un servicio
    const restaurantData = {
      restaurantName: 'Restaurante El Olivo',
      cuisineType: 'Mediterránea',
      address: 'Calle Mayor 123, Madrid, España',
      phone: '+34 912 345 678',
      email: 'info@elolivo.com'
    };

    this.restaurantForm.patchValue(restaurantData);
  }

  onSubmit(): void {
    if (this.restaurantForm.valid) {
      // Aquí iría la lógica para guardar los cambios
      // Por ejemplo, llamar a un servicio que actualice los datos en el backend
    } else {
      this.markFormGroupTouched(this.restaurantForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get restaurantName() { return this.restaurantForm.get('restaurantName'); }
  get cuisineType() { return this.restaurantForm.get('cuisineType'); }
  get address() { return this.restaurantForm.get('address'); }
  get phone() { return this.restaurantForm.get('phone'); }
  get email() { return this.restaurantForm.get('email'); }
}
