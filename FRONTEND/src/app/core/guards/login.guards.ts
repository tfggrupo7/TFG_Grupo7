import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_: any, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the correct authentication check, e.g., authService.isAuthenticated() or similar
  if (typeof authService.isAuthenticated === 'function' ? authService.isAuthenticated() : false) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};