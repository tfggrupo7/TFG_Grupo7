import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IEmpleados } from '../../interfaces/iempleados.interfaces';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private router: Router, private httpClient: HttpClient) { }

  //Ejemplo
  setToken = (token: string) => {
    sessionStorage.setItem("token", token)
  }

  getToken = () => {
    return sessionStorage.getItem("token")
  }

  login(email: string, password: string): Promise<IEmpleados | null> {
    const body = { email, password };
    return lastValueFrom(
      this.httpClient.post<IEmpleados>('http://localhost:3000/api/empleados/login', body, { observe: 'response' })
    ).then((response: any) => response.body as IEmpleados || null);
  }
  recuperarContrasena(email: string): Promise<void> {
    return lastValueFrom(this.httpClient.post<void>('http://localhost:3000/api/empleados/recuperar-contrasena', { email }));
  }
  actualizarContrasena(token: string, nuevaContrasena: string): Promise<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  return lastValueFrom(this.httpClient.post(`http://localhost:3000/api/empleados/restablecer-contrasena/${token}`, { nuevaContrasena }, { headers }));
}

  logout(): void {
    localStorage.removeItem('token'); 
    localStorage.clear(); 

    this.router.navigate(['/empleados/login']);
  }

  getCurrentUserIdFromToken(): string | null {
    const token = localStorage.getItem('user');
    if (!token) return null;
    // JWT: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return null;
    try {
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }
}
