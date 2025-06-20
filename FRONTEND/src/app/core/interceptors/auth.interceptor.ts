import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const cloneRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
    return next(cloneRequest);
  }
  return next(req);
};
