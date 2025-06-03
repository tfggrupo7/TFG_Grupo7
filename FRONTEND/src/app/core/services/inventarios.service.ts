import { Injectable, inject } from '@angular/core';
import { IInventarios } from '../../interfaces/iinventarios.interfaces';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class InventariosService {
  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/inventarios';

  getInventarios(): Promise<IInventarios[]> {
    return lastValueFrom(this.httpClient.get<IInventarios[]>(this.url));
  }
  getInventarioById(id: number): Promise<IInventarios> {
    return lastValueFrom(
      this.httpClient.get<IInventarios>(`${this.url}/${id}`)
    );
  }
  createInventario(inventario: IInventarios): Promise<IInventarios> {
    return lastValueFrom(
      this.httpClient.post<IInventarios>(this.url, inventario)
    );
  }
  updateInventario(
    id: number,
    inventario: IInventarios
  ): Promise<IInventarios> {
    return lastValueFrom(
      this.httpClient.put<IInventarios>(`${this.url}/${id}`, inventario)
    );
  }
  deleteInventario(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
}
