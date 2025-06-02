import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { HeaderComponent } from '../../shared/header/header.component';


@Component({
  selector: 'app-restablecer-contrasena',
  imports: [ReactiveFormsModule, HeaderComponent],
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
    private usuarioService: UsuarioService,
    private router: Router
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

  ngOnInit() {
    // Obtiene el token de la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('nuevaContrasena')?.value;
    const repeat = form.get('repetirContrasena')?.value;
    return pass === repeat ? null : { mismatch: true };
  }


  async enviar() {
    try {
  await this.usuarioService.actualizarContrasena(this.token, this.form.value.nuevaContrasena);
  this.mensaje = '¡Contraseña cambiada correctamente!';
  setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000); 
  
} catch (e) {
  if (typeof e === 'object' && e !== null && 'error' in e && typeof (e as any).error === 'object' && (e as any).error !== null && 'message' in (e as any).error) {
    this.error = (e as any).error.message; // Mostrar el mensaje de error específico
  } else {
    this.error = 'Ocurrió un error. Intenta de nuevo más tarde.';
  }
  console.error('Error al actualizar la contraseña:', e);
}
}
}
