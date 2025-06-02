import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmpleados } from '../../interfaces/iempleados.interfaces';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/empleados';

  getEmpleados(): Promise<IEmpleados[]> {
    return lastValueFrom(this.httpClient.get<IEmpleados[]>(this.url));
  }
  getEmpledosAndTareas(): Promise<IEmpleados[]> {
    return lastValueFrom(this.httpClient.get<IEmpleados[]>(`${this.url}/tareas`));
  }
  getEmpleadoById(id: number): Promise<IEmpleados> {
    return lastValueFrom(this.httpClient.get<IEmpleados>(`${this.url}/${id}`));
  }
  createEmpleado(empleado: IEmpleados): Promise<IEmpleados> {
    return lastValueFrom(this.httpClient.post<IEmpleados>(this.url, empleado));
  }
  updateEmpleado(id: number, empleado: IEmpleados): Promise<IEmpleados> {
    return lastValueFrom(
      this.httpClient.put<IEmpleados>(`${this.url}/${id}`, empleado)
    );
  }
  deleteEmpleado(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
}
