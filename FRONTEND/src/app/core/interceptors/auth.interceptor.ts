import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // Cambiar aquí
  
  const cloneRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' // Agregar "Bearer "
    }
  })
  return next(cloneRequest);
};