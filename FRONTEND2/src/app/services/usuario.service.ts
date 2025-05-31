import { Injectable,  inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IUsuario } from '../interfaces/iusuario.interfaces';

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

 
  login(usuario:IUsuario): Promise<ILogin> {
    return lastValueFrom(this.httpClient.post<IUsuario>('http://localhost:3000/api/usuarios/login',usuario));
  }
  register(usuario:IUsuario): Promise<IUsuario> {
    return lastValueFrom(this.httpClient.post<IUsuario>('http://localhost:3000/api/usuarios/registro', usuario));
  }
}
