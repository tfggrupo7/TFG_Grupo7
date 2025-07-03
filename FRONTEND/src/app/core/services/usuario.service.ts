import { Injectable,  inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IUsuario } from '../../interfaces/iusuario.interfaces';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';


export interface ILogin {
  // Define the properties of ILogin as needed, for example:
  email:string;
  contraseña: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

 
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

 
  login(usuario: IUsuario): Promise<IUsuario> {
    return lastValueFrom(
      this.httpClient.post<IUsuario>('http://localhost:3000/api/usuarios/login', usuario, { observe: 'response' })
    ).then(response => response.body as IUsuario);
  }
  register(usuario:IUsuario): Promise<IUsuario> {
    return lastValueFrom(this.httpClient.post<IUsuario>('http://localhost:3000/api/usuarios/registro', usuario));
  }
  recuperarContrasena(email: string): Promise<void> {
    return lastValueFrom(this.httpClient.post<void>('http://localhost:3000/api/usuarios/recuperar-contrasena', { email }));
  }

  actualizarContrasena(token: string, nuevaContrasena: string): Promise<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  return lastValueFrom(this.httpClient.post(`http://localhost:3000/api/usuarios/restablecer-contrasena/${token}`, { nuevaContrasena }, { headers }));
}

cambiarContraseña (token: string, nuevaContraseña: string): Promise<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  return lastValueFrom(this.httpClient.post(`http://localhost:3000/api/usuarios/cambiar-contrasena/${token}`, { nuevaContraseña }, { headers }));
}

updateUsuario(usuario: IUsuario): Promise<IUsuario> {
  return lastValueFrom(
    this.httpClient.put<IUsuario>(
      'http://localhost:3000/api/usuarios',
      usuario
    )
  );
}
deleteUsuario(id: string): Promise<void> {
  return lastValueFrom(
    this.httpClient.delete<void>(`http://localhost:3000/api/usuarios/${id}`)
  );
}

// user.service.ts
getCurrentUser(): Promise<any> {
  const userId = this.authService.getUserId();

  if (!userId) {
    return Promise.reject(new Error('ID de usuario no válido'));
  }

  const url = `http://localhost:3000/api/usuarios/${userId}`;
  return lastValueFrom(this.httpClient.get(url));
}
}
