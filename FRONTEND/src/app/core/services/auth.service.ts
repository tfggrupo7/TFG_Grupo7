import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //TODO: Este servicio puede usarse para manejar todo lo que tenga que ver con la gestion del token por ejemplo,
  // como almacenarlo en el sessionStorage, recuperarlo, obtener el tipo de rol...
  constructor() { }

  //Ejemplo
  setToken = (token: string) => {
    sessionStorage.setItem("token", token)
  }

  getToken = () => {
    return sessionStorage.getItem("token")
  }
}
