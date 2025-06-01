import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig = {
  providers: [
    provideRouter(routes,withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    )
  ],
};
