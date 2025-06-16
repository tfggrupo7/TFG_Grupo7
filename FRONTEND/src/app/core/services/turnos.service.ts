import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITurnos } from '../../interfaces/iturnos.interfaces';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/turnos';

  getTurnos(): Promise<ITurnos[]> {
    const token = localStorage.getItem('token')?.trim();

    if (!token) {
      throw new Error('No hay token disponible');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return lastValueFrom(
      this.httpClient.get<{ data: ITurnos[] }>(this.url, { headers })
    ).then(r => r.data);
  }

  getTurnoById(id: number): Promise<ITurnos> {
    return lastValueFrom(this.httpClient.get<ITurnos>(`${this.url}/${id}`));
  }

  createTurno(turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(this.httpClient.post<ITurnos>(this.url, turno));
  }

  updateTurno(id: number, turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(
      this.httpClient.put<ITurnos>(`${this.url}/${id}`, turno)
    );
  }

  deleteTurno(id: number): Promise<{ message: string; data: ITurnos[] }> {
    return lastValueFrom(
      this.httpClient.delete<{ message: string; data: ITurnos[] }>(
        `${this.url}/${id}`
      )
    );
  }
}