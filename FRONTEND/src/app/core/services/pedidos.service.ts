import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IPedidos } from '../../interfaces/ipedidos.interfaces';
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/pedidos';

  getPedidos(): Promise<IPedidos[]> {
    return lastValueFrom(this.httpClient.get<IPedidos[]>(this.url));
  }   
  getPedidoById(id: number): Promise<IPedidos> {
    return lastValueFrom(this.httpClient.get<IPedidos>(`${this.url}/${id}`));
  }
  createPedido(pedido: IPedidos): Promise<IPedidos> {
    return lastValueFrom(this.httpClient.post<IPedidos>(this.url, pedido));
  }
  updatePedido(id: number, pedido: IPedidos): Promise<IPedidos> {
    return lastValueFrom(this.httpClient.put<IPedidos>(`${this.url}/${id}`, pedido));
  }
  deletePedido(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
}
