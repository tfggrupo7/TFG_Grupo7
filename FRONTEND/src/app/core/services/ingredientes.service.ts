import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IIngredientes } from '../../interfaces/iingredientes.interfaces';
import { lastValueFrom } from 'rxjs';
import { IInventarioResumen } from '../../interfaces/iinventarioresumen.interface';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/ingredientes';
  private _totalItems = 0;

  get totalItems() { return this._totalItems; }

  getIngredientes(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    orderBy: string = 'nombre',
    direction: string = '',
    userId: string = ''
  ): Promise<IIngredientes[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search)
      .set('orderBy', orderBy)
      .set('direction', direction)
      .set('userId', userId);
      const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

    return lastValueFrom(this.httpClient.get<any>(this.url, { params })).then(
      (resp) => {
        this._totalItems = resp.total;
        return resp.data as IIngredientes[];
      }
    );
  }

  getIngredienteById(id: number): Promise<IIngredientes> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.get<IIngredientes>(`${this.url}/${id}`));
  }

  getResumen(userId: string): Promise<IInventarioResumen> {
    const params = new HttpParams().set('userId', userId);
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.get<IInventarioResumen>(`${this.url}/summary`, {params}));
  }

  createIngrediente(ingrediente: IIngredientes): Promise<IIngredientes> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.post<IIngredientes>(this.url, ingrediente));
  }
  updateIngrediente(id: number, ingrediente: IIngredientes): Promise<IIngredientes> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.put<IIngredientes>(`${this.url}/${id}`, ingrediente));
  }
  deleteIngrediente(id: number): Promise<void> {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
}
