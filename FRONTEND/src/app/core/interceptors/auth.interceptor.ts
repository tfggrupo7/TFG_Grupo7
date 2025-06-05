import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
<<<<<<< HEAD
  const token = localStorage.getItem('token');
  if (token) {
    const cloneRequest = req.clone({
      setHeaders: {
        'Authorization': `${token}`
      }
    });
    return next(cloneRequest);
  }
  return next(req);
=======
  const cloneRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token') || ''
    }
  })
  return next(cloneRequest);
>>>>>>> origin/SCRUM-45-seccion-inventario
};
