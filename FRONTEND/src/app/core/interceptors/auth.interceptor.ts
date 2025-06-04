import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const cloneRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token') || ''
    }
  })
  return next(cloneRequest);
};
