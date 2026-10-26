import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {authRoutes, guestRoutes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {AuthConfig} from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(guestRoutes),
    provideRouter(authRoutes),
    provideHttpClient()
  ]
};

/*
export const authConfig: AuthConfig = {
  issuer: 'http:localhost:9001', // e.g., http://localhost:8000
  redirectUri: window.location.origin + '/auth/callback',
  clientId: '019bd711-bd29-735c-9f6f-7e5b3b995257', // The public client ID from Laravel
  responseType: 'code',
  scope: '',
  showDebugInformation: true,
  // PKCE options
  disablePKCE: false,
  requireHttps: false // Set to true in production
};*/


