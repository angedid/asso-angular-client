import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../login.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-authorization-callback',
  templateUrl: './authorization-callback.component.html',
  styleUrls: ['./authorization-callback.component.css']
})
export class AuthorizationCallbackComponent {
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {
    this.activatedRoute.queryParams.subscribe((params)=>{
      console.log(params);
      let state = params['state'];
      let code = params['code'];
      let authorizationChallenge = localStorage.getItem(state);
      if (authorizationChallenge === null){
        console.error('no challenge configured');
        return;
      }
      let authorizationChallengeJson = JSON.parse(authorizationChallenge);
      console.log("(" + authorizationChallengeJson['id'] + ", " + state + ")")
      if (authorizationChallengeJson['id'] !== state){
        console.error('challenge id different from state. Challenge id: ' + authorizationChallengeJson['id'] + '  state: ' + state);
        return;
      }
      //
      console.log('making request to access token');
      //this.loginService.requestAccessToken(code, params['id']);
      this.authService.handleCallback(code, state, authorizationChallengeJson['code_verifier'], this.router, this.activatedRoute).then(() => {
        console.log("Token request ended successfully");
      });
    });
  }

}
