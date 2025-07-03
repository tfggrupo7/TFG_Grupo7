import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IEmpleados } from '../../interfaces/iempleados.interfaces';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../../interfaces/login-response.interfaces';
import { jwtDecode } from 'jwt-decode';



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private router: Router, private httpClient: HttpClient) { }

  //Ejemplo
  setToken = (token: string) => {
    localStorage.setItem("token", token)
  }

  getToken = () => {
    return localStorage.getItem("token")
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const body = { email, password };
    const response = await lastValueFrom(
      this.httpClient.post<LoginResponse>('http://localhost:3000/api/empleados/login', body, { observe: 'response' })
    );
    return response.body as LoginResponse;
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
    const token = localStorage.getItem('token');
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
  getRolEmpleado(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.role || '';
    } catch (e) {
      console.error('Error decoding token:', e);
      return '';
    }
  } 
  getUserFromToken(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decodificando token:', error);
        return null;
      }
    }
    return null;
  }

  getUserId(): string | null {
    const tokenData = this.getUserFromToken();
    
    if (!tokenData) {
      return null;
    }
    
    // Tu token tiene el ID en usuario_id
    const userId = tokenData.usuario_id;
       
    return userId ? String(userId) : null;
  }

getUserFromTokenEmpleado(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decodificando token:', error);
        return null;
      }
    }
    return null;
  }

  getEmpleadoId(): string | null {
    const tokenData = this.getUserFromTokenEmpleado();
    if (!tokenData) return null;
    
    // Buscar el ID del empleado en diferentes propiedades posibles
    const empleadoId = tokenData.empleado_id || 
                      tokenData.id_empleado || 
                      tokenData.empleadoId ||
                      tokenData.usuario_id || // Si usan la misma tabla
                      tokenData.id;
    
    return empleadoId ? String(empleadoId) : null;
  }

  getUserType(): string {
    const tokenData = this.getUserFromToken();
    return tokenData?.tipo || tokenData?.role || tokenData?.user_type || 'empleado';
  }
}
