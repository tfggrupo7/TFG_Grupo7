import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { SpinnerInterceptor } from './core/interceptors/spinner.interceptor';


export const appConfig = {
  providers: [
    provideRouter(routes,withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([AuthInterceptor,SpinnerInterceptor])
    ), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ],
};
