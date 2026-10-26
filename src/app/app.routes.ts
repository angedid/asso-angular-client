import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {FourOFour} from './four-ofour/four-ofour';
import {HomeComponent} from './home/home.component';
import {AuthorizationCallbackComponent} from './authorization-callback/authorization-callback.component';

export const guestRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    title: 'Welcome'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register'
  },
  {
    path: 'oauth/callback',
    component: AuthorizationCallbackComponent,
    title: 'Auth-Callback'
  },
  {
    path: '**',
    component: FourOFour
  }

];

export const authRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
  }

];

