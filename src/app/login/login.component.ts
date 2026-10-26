import {Component, inject} from '@angular/core';

import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {AuthService} from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginService = inject(LoginService);
  authService = inject(AuthService);

  constructor() {
    //this.loginService.requestCodePKCE();
    this.authService.requestCodePKCE().then(() => {
      console.log("REQUEST CODE IN PKCE CONTEXT MADE");
    });
  }

}
