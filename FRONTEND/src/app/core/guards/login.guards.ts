import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';



export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  //redux, stagejs son librerias que trabajan de manera similar al localstorage
  let token = localStorage.getItem('token') || null
  if (!token) {
    router.navigate(['/login'])
    return false;
  }
  return true;
};
