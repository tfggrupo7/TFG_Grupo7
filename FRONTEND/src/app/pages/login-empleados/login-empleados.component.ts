import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';





@Component({
  selector: 'app-login-empleados',
  imports: [ReactiveFormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './login-empleados.component.html',
  styleUrl: './login-empleados.component.css'
})
export class LoginEmpleadosComponent {

loginForm: FormGroup = new FormGroup({}, []);

constructor(private fb: FormBuilder, private router: Router, private authService: AuthService){
  this.loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
}

  async ingresar() {
  if (this.loginForm.invalid) {
    toast.info('Error en email o contraseña');
    return;
  }
  const email: string = this.loginForm.get('email')?.value;
  const password: string = this.loginForm.get('password')?.value;
  try {
    const response = await this.authService.login(email, password);
    if (response && response.token) {
      // Guarda el token en localStorage
      localStorage.setItem('token', response.token);

      toast.success("Login Exitoso");
      setTimeout(() => {
        this.router.navigate(['/dashboard-empleados']);
      }, 1000);
    } else {
      toast.error('Email o contraseña incorrectos.');
    }
  } catch (error) {
    toast.error('Error al iniciar sesión.');
  }
}
}
