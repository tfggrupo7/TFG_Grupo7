/**
 * Servicio Angular para gestionar la entidad **Turnos**.
 * ------------------------------------------------------
 * Encapsula todas las llamadas HTTP (CRUD) hacia la API
 * `/api/turnos`.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITurnos } from '../../interfaces/iturnos.interfaces';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root', // Servicio singleton a nivel de aplicación
})
export class TurnosService {

  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/turnos';

  /**
   * GET /api/turnos
   * --------------------------------------------------
   * Recupera todos los turnos. La API espera un JWT en la cabecera
   * `Authorization`.  Si el token no existe, se lanza un error
   * sin llegar a hacer la petición.
   *
   * @returns Promise<ITurnos[]> Resuelve con el array recibido
   */
  getTurnos(): Promise<ITurnos[]> {
    const token = localStorage.getItem('token')?.trim();

    if (!token) {
      // Bloqueamos la llamada si no hay autenticación
      throw new Error('No hay token disponible');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // lastValueFrom convierte Observable en Promise<response>
    return lastValueFrom(
      this.httpClient.get<{ data: ITurnos[] }>(this.url, { headers })
    ).then(r => r.data);
  }

  /**
   * GET /api/turnos/hoy?date=YYYY-MM-DD
   * --------------------------------------------------
   * Recupera los turnos filtrados por una fecha concreta.
   * @param date Fecha en formato YYYY-MM-DD
   * @returns Promise<ITurnos[]> Array de turnos para la fecha indicada
   */
  getTurnosByDate(date: string): Promise<ITurnos[]> {
    const token = localStorage.getItem('token')?.trim();
    if (!token) throw new Error('No hay token disponible');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return lastValueFrom(
      this.httpClient.get<ITurnos[]>(`${this.url}/date/${date}`, { headers })
    );
  }


  /**
   * GET /api/turnos/:id
   * --------------------------------------------------
   * Obtiene un turno por su ID.
   * @param id PK del turno
   * @returns Promise<ITurnos>
   */
  getTurnoById(id: number): Promise<ITurnos> {
    return lastValueFrom(this.httpClient.get<ITurnos>(`${this.url}/${id}`));
  }

  /**
   * POST /api/turnos
   * --------------------------------------------------
   * Crea un turno nuevo.
   * @param turno Payload que cumple la interfaz ITurnos
   * @returns Promise<ITurnos> Registro creado
   */
  createTurno(turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(this.httpClient.post<ITurnos>(this.url, turno));
  }

  /**
   * PUT /api/turnos/:id
   * --------------------------------------------------
   * Actualiza un turno existente.
   * @param id    Clave primaria
   * @param turno Campos modificados
   * @returns Promise<ITurnos> Registro resultante
   */
  updateTurno(id: number, turno: ITurnos): Promise<ITurnos> {
    return lastValueFrom(
      this.httpClient.put<ITurnos>(`${this.url}/${id}`, turno)
    );
  }

  /**
   * DELETE /api/turnos/:id
   * --------------------------------------------------
   * Elimina un turno.  La API responde con un mensaje y la lista
   * restante de turnos; el genérico refleja esa estructura.
   * @param id PK del turno a borrar
   * @returns Promise<{ message: string; data: ITurnos[] }>
   */
  deleteTurno(id: number): Promise<{ message: string; data: ITurnos[] }> {

    return lastValueFrom(
      this.httpClient.delete<{ message: string; data: ITurnos[] }>(
        `${this.url}/${id}`
    )
  )
  }

  getTurnosByEmpleado(empleadoId: number): Promise<ITurnos[]> {
    const token = localStorage.getItem('token')?.trim();
    if (!token) throw new Error('No hay token disponible');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  return lastValueFrom (this.httpClient.get<ITurnos[]>(`${this.url}/empleado/${empleadoId}`, { headers }));
}

  // En tu turnosService
getTurnosByDateAndEmpleado(fecha: string, empleadoId: number): Promise<ITurnos[]> {
  const token = localStorage.getItem('token')?.trim();
    if (!token) throw new Error('No hay token disponible');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  return lastValueFrom(this.httpClient.get<ITurnos[]>(`${this.url}/fecha/${fecha}/empleado/${empleadoId}`, { headers }));
}
 sendTurnosByEmail(turnos: ITurnos[]): Promise<void> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    return lastValueFrom(
      this.httpClient.post<void>(
        `${this.url}/send/pdf`,
        { turnos },
        { headers }
      )
    );
  }
  sendTurnosEmpleadoByEmail(empleadoId: number, email: string): Promise<void> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    return lastValueFrom(
      this.httpClient.post<void>(
        `${this.url}/empleado/${empleadoId}/send/pdf`,
        { empleadoId, email },
        { headers }
      )
    );
  }
  downloadTurnos(): Promise<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    return lastValueFrom(
      this.httpClient.get(`${this.url}/export/pdf`, {
        responseType: 'blob',
        headers: headers,
      })
    );
  }
  downloadTurnosPorId(empleadoId: number): Promise<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    return lastValueFrom(
      this.httpClient.get(`${this.url}/empleado/${empleadoId}/pdf`, {
        responseType: 'blob',
        headers: headers,
      })
    );
  }
  getTurnosAndEmpleadoById(id: number): Promise<ITurnos[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      });
      return lastValueFrom(
        this.httpClient.get<ITurnos[]>(`${this.url}/empleado/${id}`)
      );
    }
}
