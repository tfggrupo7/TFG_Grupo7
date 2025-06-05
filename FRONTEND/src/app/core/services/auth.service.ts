import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
   constructor(private router: Router) { }

  //Ejemplo
  setToken = (token: string) => {
    sessionStorage.setItem("token", token)
  }

  getToken = () => {
    return sessionStorage.getItem("token")
  }
  
  logout(): void {
  localStorage.removeItem('token'); 
  localStorage.clear(); 

  this.router.navigate(['/login']);
}
getCurrentUserIdFromToken(): string | null {
  const token = localStorage.getItem('user');
  if (!token) return null;
  // JWT: header.payload.signature
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}
}
