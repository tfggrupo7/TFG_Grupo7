import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IUsuario } from '../../interfaces/iusuario.interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Ilogin } from '../../interfaces/ilogin.interfaces';
import { toast } from 'ngx-sonner';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  rightPanelActive = false;
  usuario!: IUsuario;
  user!:Ilogin;
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

initializeLoginFormWithUsuario() {
  this.loginForm = new FormGroup({
    email: new FormControl(this.usuario ? this.usuario.email : '', [Validators.required, Validators.email]),
    contraseña: new FormControl(this.usuario ? this.usuario.contraseña : '', Validators.required)
  });
}


  async ingresar() {
    console.log('loginForm.value:', this.loginForm.value);
    if (this.loginForm.invalid) {
      toast.info('Por favor, completa todos los campos correctamente.');
      return;
    }
    const usuario: IUsuario = {
      nombre: '',
      apellidos: '',
      email: this.loginForm.value.email,
      contraseña: this.loginForm.value.contraseña
    };
    try {
      await this.usuarioService.login(usuario);
      toast.success("Login Exitoso");
      setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000); 
    } catch (error) {
      alert('Error al iniciar sesión.');
    }
}

initializeRegisterFormWithUsuario() {
  this.registerForm = new FormGroup({
    email: new FormControl(this.usuario ? this.usuario.email : '', [Validators.required, Validators.email]),
    contraseña: new FormControl(this.usuario ? this.usuario.contraseña : '', Validators.required),
    nombre: new FormControl(this.usuario ? this.usuario.nombre : '', Validators.required),
    apellidos: new FormControl(this.usuario ? this.usuario.apellidos : '', Validators.required)
    });
}

async registrar() {
console.log('registerForm.value:', this.registerForm.value);
    if (this.registerForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
    const usuario = this.registerForm.value;
    try {
      await this.usuarioService.register(usuario);
      toast.success("Usuario registrado correctamente");
      setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000); 
    } catch (error) {
      alert('Error al registrar usuario.');
    }
  }
}
