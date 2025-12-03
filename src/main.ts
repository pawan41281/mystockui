/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { tokenInterceptor } from './app/demo/auth/token-interceptor';
import { refreshInterceptorInterceptor } from './app/demo/auth/refresh-interceptor-interceptor';

ModuleRegistry.registerModules([AllCommunityModule]);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule, AppRoutingModule), provideAnimations(), provideHttpClient(withInterceptors([tokenInterceptor, refreshInterceptorInterceptor]))]//, errorInterceptor
}).catch((err) => console.error(err));
