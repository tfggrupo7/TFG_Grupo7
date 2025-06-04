import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IIngredientes } from '../../interfaces/iingredientes.interfaces';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

 private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/ingredientes';

  getIngredientes(): Promise<IIngredientes[]> {
    return lastValueFrom(this.httpClient.get<IIngredientes[]>(this.url));
  }
  getIngredienteById(id: number): Promise<IIngredientes> {
    return lastValueFrom(this.httpClient.get<IIngredientes>(`${this.url}/${id}`));
  }
  createIngrediente(ingrediente: IIngredientes): Promise<IIngredientes> {
    return lastValueFrom(this.httpClient.post<IIngredientes>(this.url, ingrediente));
  }
  updateIngrediente(id: number, ingrediente: IIngredientes): Promise<IIngredientes> {
    return lastValueFrom(this.httpClient.put<IIngredientes>(`${this.url}/${id}`, ingrediente));
  }
  deleteIngrediente(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
}
