import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITurnos } from '../../interfaces/iturnos.interfaces';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/turnos';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }

  getTurnos(page: number = 1, limit: number = 10): Promise<{ page: number, limit: number, total: number, data: ITurnos[] }> {
    const fullUrl = `${this.url}?page=${page}&limit=${limit}`;
    return lastValueFrom(
      this.httpClient.get<{ page: number, limit: number, total: number, data: ITurnos[] }>(
        fullUrl,
        this.getAuthHeaders()
      )
    );
  }

  getTurnoById(id: number): Promise<ITurnos> {
    return lastValueFrom(
      this.httpClient.get<ITurnos>(`${this.url}/${id}`, this.getAuthHeaders())
    );
  }

  createTurno(turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(
      this.httpClient.post<ITurnos>(this.url, turno, this.getAuthHeaders())
    );
  }

  updateTurno(id: number, turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(
      this.httpClient.put<ITurnos>(`${this.url}/${id}`, turno, this.getAuthHeaders())
    );
  }

  deleteTurno(id: number): Promise<{ message: string, data: ITurnos[] }> {
    return lastValueFrom(
      this.httpClient.delete<{ message: string, data: ITurnos[] }>(`${this.url}/${id}`, this.getAuthHeaders())
    );
  }
}
