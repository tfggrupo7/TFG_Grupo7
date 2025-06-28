import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { IUsuario } from '../../../interfaces/iusuario.interfaces';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario: IUsuario = {
    nombre: '',
    apellidos: '',
    email: '',
    contraseña: '',
  };

  datosForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: any = null;
  constructor(
    private usuariosService: UsuarioService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.datosForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.passwordForm = this.fb.group(
      {
        contraseñaActual: ['', [Validators.required, Validators.minLength(6)]],
        nuevaContraseña: ['', [Validators.required, Validators.minLength(6)]],
        contraseñaRepetida: [
          '',
          [Validators.required, Validators.minLength(6)],
        ],
      },
      { validators: [this.passwordsMatchValidator] }
    );

    // Si tienes datos del usuario, puedes setearlos así:
    this.datosForm.patchValue({
      nombre: this.usuario.nombre,
      email: this.usuario.email,
      apellidos: this.usuario.apellidos,
    });
    this.loadCurrentUser();
  }
async loadCurrentUser() {
  try {
    this.currentUser = await this.usuariosService.getCurrentUser()
  } catch (error) {
    console.error('Error cargando usuario:', error);
  }
}

  // Validador de coincidencia de contraseñas
  passwordsMatchValidator(form: FormGroup) {
    const contrasenaActual = form.get('passwordActual')?.value;
    const nuevaContraseña = form.get('passwordNueva')?.value;
    const repeat = form.get('passwordRepetir')?.value;
    return nuevaContraseña === repeat ? null : { mismatch: true };
  }

  async actualizarDatos() {
    if (this.datosForm.invalid) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      const usuarioActualizado: IUsuario = { ...this.datosForm.value };
      await this.usuariosService.updateUsuario(usuarioActualizado);
      toast.success('Empleado actualizado correctamente');
      await this.loadCurrentUser(); // Recargar el usuario actualizado
      this.router.navigate(['/dashboard']);
    } catch (error) {
      toast.error('Fallo al actualizar el empleado');
    }
  }

  async cambiarPassword() {
    const { contraseñaActual, nuevaContraseña, contraseñaRepetida } =
      this.passwordForm.value;

    try {
      // Debes obtener el token de alguna manera, por ejemplo desde localStorage o un servicio de autenticación
      const token = localStorage.getItem('token'); // Ajusta esto según cómo almacenes el token

      if (!token) {
        toast.error('No se encontró el token de autenticación.');
        return;
      }

      await this.usuariosService.cambiarContraseña(
        token,
        this.passwordForm.value.nuevaContraseña
      );
      toast.success('Contraseña cambiada correctamente');
      this.passwordForm.reset();
    } catch (error) {
      // Si quieres ver el mensaje exacto del backend:
      if (
        typeof error === 'object' &&
        error !== null &&
        'error' in error &&
        typeof (error as any).error === 'object' &&
        (error as any).error !== null &&
        'message' in (error as any).error
      ) {
      }
      toast.error(
        'Error al cambiar la contraseña. Verifica tu contraseña actual.'
      );
    }
  }

  eliminarUsuario() {
    // Recupera el token y decodifica el id
    const token = localStorage.getItem('token');
    let usuarioId = null;
    if (token) {
      const payload: any = jwtDecode(token);
      usuarioId = payload.usuario_id;
    }

    // Modal de confirmación nativo
    toast(
      '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer y eliminará todos los empleados.',
      {
        action: {
          label: 'Aceptar',
          onClick: async () => {
            try {
              await this.usuariosService.deleteUsuario(usuarioId);
              toast.success('Cuenta eliminada');
              this.router.navigate(['/login']).then(() => {
                window.location.reload();
              });
            } catch {
              toast.error(
                'Error al eliminar la cuenta. Inténtalo de nuevo más tarde.'
              );
            }
          },
        },
      }
    );
  }
}
