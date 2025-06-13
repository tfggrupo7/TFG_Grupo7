import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperacion-contrasena-empleados',
  imports: [ReactiveFormsModule,HeaderComponent],
  templateUrl: './recuperacion-contrasena-empleados.component.html',
  styleUrl: './recuperacion-contrasena-empleados.component.css'
})
export class RecuperacionContrasenaEmpleadosComponent {
form: FormGroup;
  mensaje = '';
  error = '';
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async enviar() {
    this.mensaje = '';
    this.error = '';
    console.log('Formulario enviado:', this.form.value);
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return;
    }
    try {
      await this.authService.recuperarContrasena(this.form.value.email);
      this.mensaje = 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.';
      console.log('Enlace de recuperación enviado');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000); 
    } catch (e) {
      this.error = 'Ocurrió un error. Intenta de nuevo más tarde.';
      console.error('Error al recuperar contraseña:', e);
    }
  }
}

