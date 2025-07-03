import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IUsuario } from '../../interfaces/iusuario.interfaces';
import { UsuarioService } from '../../core/services/usuario.service';
import { inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from '../../interfaces/ilogin.interfaces';
import { toast } from 'ngx-sonner';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink,HeaderComponent,FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  rightPanelActive = false;
  usuario!: IUsuario;
  user!:ILogin;
  usuarioService = inject (UsuarioService);
  router = inject(Router);

loginForm: FormGroup = new FormGroup({}, [])
registerForm : FormGroup = new FormGroup({}, [])

constructor(private fb: FormBuilder){
  this.loginForm = this.fb.group({
    email: ['', Validators.required],
    contraseña: ['', Validators.required]
  });
}

  onSignUp() {
    this.rightPanelActive = true;
  }

  onSignIn() {
    this.rightPanelActive = false;
  }
  ngOnInit() {
  this.initializeLoginFormWithUsuario();
  this.initializeRegisterFormWithUsuario();
}
mostrarLogin(event: Event) {
  event.preventDefault();
  this.rightPanelActive = false;
}

mostrarRegistro(event: Event) {
  event.preventDefault();
  this.rightPanelActive = true;
}

initializeLoginFormWithUsuario() {
  this.loginForm = new FormGroup({
    email: new FormControl(this.usuario ? this.usuario.email : '', [Validators.required, Validators.email]),
    contraseña: new FormControl(this.usuario ? this.usuario.contraseña : '', [Validators.required, Validators.minLength(6)])
  });
}


  async ingresar() {
  if (this.loginForm.invalid) {
    toast.info('Error en email o contraseña');
    return;
  }
  const usuario: IUsuario = {
    nombre: '',
    apellidos: '',
    email: this.loginForm.value.email,
    contraseña: this.loginForm.value.contraseña
  };
  try {
     // Suponiendo que el backend responde { token: '...', usuario: {...} }
    const response = await this.usuarioService.login(usuario);
    const token = response.token;
if (token) {
  localStorage.setItem('token', token);
  toast.success("Login Exitoso");
  setTimeout(() => {
    this.router.navigate(['/dashboard']);
  }, 1000);
} else {
  toast.error('No se recibió token de autenticación.');
}
  } catch (error) {
    toast.error('Error al iniciar sesión.');
  }
}

initializeRegisterFormWithUsuario() {
  this.registerForm = new FormGroup({
    email: new FormControl(this.usuario ? this.usuario.email : '', [Validators.required, Validators.email]),
    contraseña: new FormControl(this.usuario ? this.usuario.contraseña : '', [Validators.required, Validators.minLength(6)]),
    nombre: new FormControl(this.usuario ? this.usuario.nombre : '', [Validators.required, Validators.minLength(3)]),
    apellidos: new FormControl(this.usuario ? this.usuario.apellidos : '', [Validators.required, Validators.minLength(3)])
    });
}

async registrar() {
  if (this.registerForm.invalid) {
    toast.info('Por favor, completa todos los campos correctamente.');
    return;
  }

  const usuario = this.registerForm.value;

  try {
    const response = await this.usuarioService.register(usuario);
    toast.success("Usuario registrado correctamente");
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    if (error.error && error.error.message === 'El email ya está registrado.') {
      toast.error('Este email ya está registrado. Por favor, utiliza otro.');
    } else {
      toast.error('Error al registrar usuario.');
    }
  }
}
  
}

