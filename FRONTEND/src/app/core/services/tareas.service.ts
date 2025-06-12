import { Injectable , inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITareas } from '../../interfaces/itareas.interfaces';
import { lastValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/tareas';

  getTareas(): Promise<ITareas[]> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.get<ITareas[]>(this.url));
  }
  getTareasAndEmpleadoById(id: number): Promise<ITareas[]> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.get<ITareas[]>(`${this.url}/empleado/${id}`));
  }
  getTareaById(id: number): Promise<ITareas> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.get<ITareas>(`${this.url}/${id}`));
  }
  createTarea(tarea: ITareas): Promise<ITareas> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.post<ITareas>(this.url, tarea));
  }
  updateTarea(id: number, tarea: ITareas): Promise<ITareas> {
    return lastValueFrom(this.httpClient.put<ITareas>(`${this.url}/${id}`, tarea));
  }
  deleteTarea(id: number): Promise<void> {    
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  } 
  sendTareasByEmail(tareas: ITareas[]): Promise<void> {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }); 
    console.log('Headers:', headers);
    return lastValueFrom(this.httpClient.post<void>(`${this.url}/send/pdf`, { tareas}, { headers }));
    }
    downloadTareas(): Promise<Blob> {
    const token = localStorage.getItem('token');    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ?
        { 'Authorization': `Bearer ${token}` } : {})
    });
    return lastValueFrom(this.httpClient.get(`${this.url}/export/pdf`, {
      responseType: 'blob',
      headers: headers
    }));
  }
}
