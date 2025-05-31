import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-restablecer-contrasena',
  imports: [ReactiveFormsModule],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrl: './restablecer-contrasena.component.css',
})
export class RestablecerContrasenaComponent {
  form: FormGroup;
  mensaje = '';
  error = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group(
      {
        nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
        repetirContrasena: ['', [Validators.required]]
      },
      { validators: [this.passwordsMatchValidator] }
    );

    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('nuevaContrasena')?.value;
    const repeat = form.get('repetirContrasena')?.value;
    return pass === repeat ? null : { mismatch: true };
  }


  async enviar() {
    this.mensaje = '';
    this.error = '';
    if (this.form.invalid) return;
    try {
      await this.usuarioService.actualizarContrasena(this.token, this.form.value.nuevaContrasena);
      this.mensaje = '¡Contraseña cambiada correctamente!';
    } catch (e) {
      this.error = 'Ocurrió un error. Intenta de nuevo más tarde.';
    }
  }
  
  ngOnInit() {
    // Obtiene el token de la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  async onSubmit() {
    try {
      await this.usuarioService.actualizarContrasena(this.token, this.form.value.nuevaContrasena);
      this.mensaje = '¡Contraseña actualizada exitosamente!';
    } catch (error) {
      this.mensaje = 'Error al actualizar la contraseña.';
    }
  }
  /*actualizarContrasena() {
    const nuevaContrasena = this.form.value.nuevaContrasena;
    const repetirContrasena = this.form.value.repetirContrasena;
    if (nuevaContrasena !== repetirContrasena) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    this.usuarioService.actualizarContrasena(this.token, nuevaContrasena)
      .then(() => {
        this.mensaje = 'Contraseña actualizada correctamente.';
        this.form.reset();
      })
      .catch((error) => {
        this.error = 'Ocurrió un error al actualizar la contraseña.';
        console.error(error);
      });
  }*/
}
