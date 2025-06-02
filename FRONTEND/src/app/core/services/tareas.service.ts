import { Injectable , inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITareas } from '../../interfaces/itareas.interfaces';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/tareas';

  getTareas(): Promise<ITareas[]> {
    return lastValueFrom(this.httpClient.get<ITareas[]>(this.url));
  }
  getTareasAndEmpleadoById(id: number): Promise<ITareas[]> {
    return lastValueFrom(this.httpClient.get<ITareas[]>(`${this.url}/empleado/${id}`));
  }
  getTareaById(id: number): Promise<ITareas> {
    return lastValueFrom(this.httpClient.get<ITareas>(`${this.url}/${id}`));
  }
  createTarea(tarea: ITareas): Promise<ITareas> {
    return lastValueFrom(this.httpClient.post<ITareas>(this.url, tarea));
  }
  updateTarea(id: number, tarea: ITareas): Promise<ITareas> {
    return lastValueFrom(this.httpClient.put<ITareas>(`${this.url}/${id}`, tarea));
  }
  deleteTarea(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  } 
}
