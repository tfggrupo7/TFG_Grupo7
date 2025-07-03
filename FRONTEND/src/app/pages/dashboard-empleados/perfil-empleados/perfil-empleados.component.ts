import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de tener jwt-decode instalado y configurado

@Component({
  selector: 'app-perfil-empleados',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil-empleados.component.html',
  styleUrl: './perfil-empleados.component.css',
})
export class PerfilEmpleadosComponent {
  empleado = {
    nombre: '',
    email: '',
    apellidos: '',
  };
  datosForm!: FormGroup;
  passwordForm!: FormGroup;
currentUser: any = null;
  constructor(
    private empleadosService: EmpleadosService,
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
    this.loadCurrentEmpleado();
  }

  // Validador de coincidencia de contraseñas
  passwordsMatchValidator(form: FormGroup) {
    const contraseñaActual = form.get('passwordActual')?.value;
    const nuevaContraseña = form.get('passwordNueva')?.value;
    const repeat = form.get('passwordRepetir')?.value;
    return nuevaContraseña === repeat ? null : { mismatch: true };
  }
  recogerToken(token: string): any {
    if (!token) return null;
    try {
      // Decodifica el payload del JWT (segunda parte)
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
  async loadCurrentEmpleado() {
  try {
    this.currentUser = await this.empleadosService.getCurrentUser()
  } catch (error) {
    console.error('Error cargando empleado:', error);
  }
}

  async actualizarEmpleado() {
    if (this.datosForm.invalid) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const token = localStorage.getItem('token');
    const payload = this.recogerToken(token || '');
    const empleadoId = payload?.id || payload?.empleado_id;

    if (!empleadoId) {
      toast.error('No se pudo obtener el ID del empleado desde el token.');
      return;
    }
    try {
      const empleadoActualizado: IEmpleados = {
        ...this.datosForm.value,
        id: Number(empleadoId),
      };

      await this.empleadosService.updateEmpleadoPerfil(empleadoActualizado);
      toast.success('Empleado actualizado correctamente');
      await this.loadCurrentEmpleado(); 
      this.router.navigate(['/dashboard-empleados']);
    } catch (error) {
      toast.error('Fallo al actualizar el empleado');
    }
  }

  async cambiarPassword() {
    const nuevaContraseña = this.passwordForm.value.nuevaContraseña;

    try {
      // Debes obtener el token de alguna manera, por ejemplo desde localStorage o un servicio de autenticación
      const token = localStorage.getItem('token') || '';
      const payload = this.recogerToken(token);
      const empleadoId = payload?.id || payload?.empleado_id;

      if (!empleadoId) {
        toast.error('No se pudo obtener el ID del empleado desde el token.');
        return;
      }

      await this.empleadosService.cambiarContraseña(
        empleadoId,
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

  eliminarEmpleado() {
    // Recupera el token y decodifica el id
    const token = localStorage.getItem('token');
    let empleadoId = null;
    if (token) {
      const payload: any = jwtDecode(token);
      empleadoId = payload.empleado_id;
    }

    // Modal de confirmación nativo
    if (
      confirm(
        '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer y eliminará todos los empleados.'
      )
    ) {
      this.empleadosService
        .deleteEmpleado(empleadoId)
        .then(() => {
          toast.success('Cuenta eliminada');
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        })
        .catch(() => {
          toast.error(
            'Error al eliminar la cuenta. Inténtalo de nuevo más tarde.'
          );
        });
    } else {
      toast.info('Eliminación cancelada');
    }
  }
}
