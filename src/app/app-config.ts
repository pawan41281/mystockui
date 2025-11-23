import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app-routing.module';
import { tokenInterceptor } from './demo/auth/token-interceptor';
import { errorInterceptor } from './demo/auth/error-interceptor';


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([tokenInterceptor, errorInterceptor]) // Register your functional interceptor here
        )
    ]
};
