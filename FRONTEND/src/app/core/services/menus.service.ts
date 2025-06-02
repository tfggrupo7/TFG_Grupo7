import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IMenus } from '../../interfaces/imenus.interfaces';
@Injectable({
  providedIn: 'root'
})
export class MenusService {

  private httpClient = inject(HttpClient);
  private url: string = 'http://localhost:3000/menus';

  getMenus(): Promise<IMenus[]> {
    return lastValueFrom(this.httpClient.get<IMenus[]>(this.url));
  }
  getMenuById(id: number): Promise<IMenus> {
    return lastValueFrom(this.httpClient.get<IMenus>(`${this.url}/${id}`));
  }
  createMenu(menu: IMenus): Promise<IMenus> {
    return lastValueFrom(this.httpClient.post<IMenus>(this.url, menu));
  }
  updateMenu(id: number, menu: IMenus): Promise<IMenus> {
    return lastValueFrom(this.httpClient.put<IMenus>(`${this.url}/${id}`, menu));
  }
  deleteMenu(id: number): Promise<void> {
    return lastValueFrom(this.httpClient.delete<void>(`${this.url}/${id}`));
  }

}
