import { Injectable , inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITurnos } from '../../interfaces/iturnos.interfaces';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

 private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/turnos';

  getTurnos(): Promise<ITurnos[]> {
    return lastValueFrom(this.httpClient.get<ITurnos[]>(this.url));
  }
  getTurnoById(id: number): Promise<ITurnos> {
    return lastValueFrom(this.httpClient.get<ITurnos>(`${this.url}/${id}`));
  }
  createTurno(turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(this.httpClient.post<ITurnos>(this.url, turno));
  }
  updateTurno(id: number, turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(this.httpClient.put<ITurnos>(`${this.url}/${id}`, turno));
  }
  deleteTurno(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  } 
}
