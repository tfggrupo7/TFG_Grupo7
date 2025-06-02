import { Injectable, inject } from '@angular/core';
import { IPlatos } from '../../interfaces/iplatos.interfaces';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatosService {

 private httpClient = inject(HttpClient);
 private url: string = 'http://localhost:3000/platos';

  getPlatos(): Promise<IPlatos[]> {
    return lastValueFrom(this.httpClient.get<IPlatos[]>(this.url));
  }
  getPlatoById(id: number): Promise<IPlatos> {
    return lastValueFrom(this.httpClient.get<IPlatos>(`${this.url}/${id}`));
  }
  createPlato(plato: IPlatos): Promise<IPlatos> {
    return lastValueFrom(this.httpClient.post<IPlatos>(this.url, plato));
  }
  updatePlato(id: number, plato: IPlatos): Promise<IPlatos> {
    return lastValueFrom(this.httpClient.put<IPlatos>(`${this.url}/${id}`, plato));
  }
  deletePlato(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
}
