import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { IUsuario } from '../../../interfaces/iusuario.interfaces';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true, // Si usas standalone components, si no, quítalo
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: IUsuario= {
    nombre: '',
    apellidos: '',
    email: '',
    contraseña: ''
    
  }

  datosForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private usuariosService: UsuarioService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Inicializa el usuario antes de usarlo (puedes cargarlo desde un servicio si lo necesitas)
    // this.usuario = ...;

    this.datosForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      Apellidos: ['', [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      passwordActual: ['', [Validators.required, Validators.minLength(6)]],
      passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepetir: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: [this.passwordsMatchValidator] });

    // Si tienes datos del usuario, puedes setearlos así:
    // this.datosForm.patchValue({
    //   nombre: this.usuario.nombre,
    //   email: this.usuario.email,
    //   rol: this.usuario.rol
    // });
  }

  // Validador de coincidencia de contraseñas
  passwordsMatchValidator(form: FormGroup) {
    const newPass = form.get('passwordNueva')?.value;
    const repeat = form.get('passwordRepetir')?.value;
    return newPass === repeat ? null : { mismatch: true };
  }

  async actualizarDatos() {
    if (this.datosForm.invalid) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      const usuarioActualizado: IUsuario = { ...this.datosForm.value };
      console.log('Actualizando usuario:', usuarioActualizado);
      await this.usuariosService.updateUsuario(usuarioActualizado);
      toast.success('Empleado actualizado correctamente');
      this.router.navigate(['/dashboard', 'personal']);
    } catch (error) {
      console.log('Error al actualizar el empleado:', error);
      toast.error('Fallo al actualizar el empleado');
    }
  }

  async cambiarPassword() {
    if (this.passwordForm.invalid) {
      toast.error('Por favor, completa correctamente el formulario de contraseña.');
      return;
    }
    if (this.passwordForm.hasError('mismatch')) {
      toast.error('Las nuevas contraseñas no coinciden.');
      return;
    }
    const { passwordActual, passwordNueva } = this.passwordForm.value;
    try {
      await this.usuariosService.actualizarContrasena(this.usuario.token || '', passwordNueva);
      toast.success('Contraseña cambiada correctamente');
      this.passwordForm.reset();
    } catch (error) {
      toast.error('Error al cambiar la contraseña. Verifica tu contraseña actual.');
    }
  }

  eliminarUsuario() {
    if (confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Aquí tu lógica para eliminar el usuario
      toast.success('Cuenta eliminada');
      // Redirige o realiza otras acciones necesarias
    }
  }
}