import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmpleados } from '../../interfaces/iempleados.interfaces';
import { lastValueFrom } from 'rxjs';
import { IResponse } from '../../interfaces/iresponse.interfaces';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/empleados';
  private currentPage: number = 1;
  private limit: number = 10;
  private totalPages: number = 2;


  getEmpleados(): Promise<IEmpleados[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    return lastValueFrom(this.httpClient.get<IEmpleados[]>(this.url, { headers }));
  }
  
  async cargarEmpleados(page: number): Promise<IResponse> {
    const url = `${this.url}?page=${page}&limit=${this.limit}`;
    const token = localStorage.getItem('token'); // Recupera el token del localStorage

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });

    return lastValueFrom(
      this.httpClient.get<IResponse>(url, { headers })
    );
}

  getEmpledosAndTareas(): Promise<IEmpleados[]> {
    return lastValueFrom(this.httpClient.get<IEmpleados[]>(`${this.url}/tareas`));
  }
  getEmpleadoById(id: number): Promise<IEmpleados> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.get<IEmpleados>(`${this.url}/${id}`));
  }
  createEmpleado(empleado: IEmpleados): Promise<IEmpleados> {
  return lastValueFrom(this.httpClient.post<IEmpleados>(this.url, empleado));
  }
  
  updateEmpleadoPerfil(empleado: IEmpleados): Promise<IEmpleados> {
  let { id, ...empleadoBody } = empleado;
  id = Number(id);
  if (!id || isNaN(id)) {
    return Promise.reject('ID de empleado inválido');
  }
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
  return lastValueFrom(
    this.httpClient.put<IEmpleados>(
      `${this.url}/${id}`,
      empleadoBody,
      { headers }
    )
  );
  }
  
  updateEmpleado(empleado: IEmpleados): Promise<IEmpleados> {
  let { id, ...empleadoBody } = empleado;
  id = Number(id);
  if (!id || isNaN(id)) {
    return Promise.reject('ID de empleado inválido');
  }
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
  return lastValueFrom(
    this.httpClient.put<IEmpleados>(
      `${this.url}/updateEmpleado/${id}`,
      empleadoBody,
      { headers }
    )
  );
  }

  deleteEmpleado(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
  
  obtenerRoles(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}/role/${id}`);
  }
  
  cambiarContraseña(empleadoId: number, nuevaContraseña: string): Promise<any> {
    return lastValueFrom(this.httpClient.post(`http://localhost:3000/api/empleados/cambiar-contrasena/${empleadoId}`, { nuevaContraseña }));
  }
  
  }
