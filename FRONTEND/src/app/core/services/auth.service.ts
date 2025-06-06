import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
   constructor(private router: Router) { }

  //Ejemplo
  setToken = (token: string) => {
    localStorage.setItem("token", token)
  }

  getToken = () => {
    return localStorage.getItem("token")
  }
  
  logout(): void {
  localStorage.removeItem('token'); 
  localStorage.clear(); 

  this.router.navigate(['/login']);
}
}
