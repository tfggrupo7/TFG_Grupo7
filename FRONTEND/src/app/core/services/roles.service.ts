import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IRoles } from '../../interfaces/iroles.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/api/roles';

  getRoles(): Promise<IRoles[]> {

    return lastValueFrom(
      this.httpClient.get<IRoles[]>(this.url)
    );
  }
  getRoleById(id: number): Promise<IRoles> {
    return lastValueFrom(this.httpClient.get<IRoles>(`${this.url}/${id}`));
  }
  createRole(role: IRoles): Promise<IRoles> {
    return lastValueFrom(this.httpClient.post<IRoles>(this.url, role));
  }
  updateRole(id: number, role: IRoles): Promise<IRoles> {
    return lastValueFrom(this.httpClient.put<IRoles>(`${this.url}/${id}`, role));
  }
  deleteRole(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }
}
