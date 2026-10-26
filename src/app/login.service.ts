import { Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import {throttle} from 'rxjs';
import {OAuthService} from 'angular-oauth2-oidc';
//import {authConfig} from './app.config';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  codeVerifier: string = '';
  state: string = '';
  codeChallenge: string = '';
  client_id: string = '';
  constructor() {
    /*this.client_id = '019bd711-bd29-735c-9f6f-7e5b3b995257';
    this.codeVerifier = this.generateSecureRandomString(80);
    this.state = this.generateInsecureRandomString(40);
    console.log("" + this.codeVerifier);
    this.codeChallenge =   btoa(this.hashData(this.codeVerifier));
    console.log(this.codeChallenge);
    this.codeChallenge = this.trimEqual(this.codeChallenge);

    this.codeChallenge = this.transform(this.codeChallenge, '+', '-');
    console.log(this.codeChallenge);
    this.codeChallenge = this.transform(this.codeChallenge, '/', '_');
    console.log(this.codeChallenge);

    sessionStorage.setItem(this.state, JSON.stringify({
      'id': this.state,
      'client_id': this.client_id,
      'code_verifier': this.codeVerifier,
      'challenge': this.codeChallenge
    }));*/

    //this.configure();
  }

  trimEqual(v:string): string{
    if (v[v.length - 1] === '='){
      console.log(v);
      v = v.substring(0, v.length - 1);
      console.log(v);
      return this.trimEqual(v);
    }
    return v;
  }

  // Define the set of alphanumeric characters
  private readonly alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  public generateSecureRandomString(length: number): string {
    // Check for browser crypto support
    if (!window.crypto || !window.crypto.getRandomValues) {
      console.error('Cryptographically secure random number generator not supported in this browser. Falling back to less secure Math.random().');
      // A fallback could be implemented here using Math.random, but it's not recommended for security purposes.
      // For general use in an Angular app, you may want to ensure crypto is available.
      return this.generateInsecureRandomString(length);
    }

    let result = '';
    const charsLength = this.alphanumericChars.length;
    // Create a Uint8Array of the desired length to hold random bytes
    const randomBytes = new Uint8Array(length);

    // Fill the array with cryptographically secure random values
    window.crypto.getRandomValues(randomBytes);

    // Loop through the random bytes to build the string
    randomBytes.forEach((byte) => {
      // Use the modulo operator to map the random byte value to an index within our character set
      // This is necessary because the random byte can be up to 255, but the char set might be smaller.
      result += this.alphanumericChars[byte % charsLength];
    });

    return result;
  }

  // Optional: A fallback using Math.random (less secure)
  private generateInsecureRandomString(length: number): string {
    let result = '';
    const charsLength = this.alphanumericChars.length;
    for (let i = 0; i < length; i++) {
      result += this.alphanumericChars[Math.floor(Math.random() * charsLength)];
    }
    return result;
  }

  transform(value: string, from: string, to: string): string {
    // Use replaceAll for multiple occurrences, or just replace for the first
    return value.replaceAll(from, to);
  }

  async sha256(message: string): Promise<string> {
    // Encode the message as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // Hash the message
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    return hashHex;
  }

  hashData(data: string): string {
    const hashedPassword = CryptoJS.SHA256(data).toString();
    return hashedPassword;
  }

  requestCodePKCE(){

    let params = new HttpParams().
        set("client_id", this.client_id).
        set("redirect_uri", 'http://localhost:4200/oauth/callback').
        set('response_type', 'code').
        set('state', this.state).
        set('code_challenge', this.codeChallenge).
        set('code_challenge_method', 'S256').
        set('scope', '').
        set('prompt', 'login'); //Create new HttpParams

    console.log(JSON.stringify(params));

    this.http.get('http://localhost:9001/oauth/authorize', {
      params: params
    }).subscribe((config) => {
      console.log('Updated config:', config);
    });
  }


  requestAccessToken(code_verifier: string, code: string){

    let tokenFormData = new FormData();
    tokenFormData.append('client_id', this.client_id);
    tokenFormData.append('redirect_uri', 'http://localhost:4200/oauth/callback');
    tokenFormData.append('grant_type', 'authorization_code');
    tokenFormData.append('code_verifier', code_verifier);
    tokenFormData.append('code', code);

    this.http.post('http://localhost:9001/oauth/token', {
      body:  tokenFormData/*JSON.stringify({
        client_id: this.client_id,
        redirect_uri: 'http://localhost:4200/oauth/callback',
        grant_type: 'authorization_code',
        code_verifier: code_verifier,
        code: code
      })*/
    }).subscribe((config) => {
      console.log('Updated config:', config);

    });
  }


  /*MzAyNTA0YTU0OGE3ZDM3ZDRiZTQ0ZmU3MmQ2ZjcwNmY2MGIyYTg3ZDYyMGJkZjEyNTJkNGJmNGQyYWQxM2FiMw
  wWQpQ9ptUHE6rd8rFgvssHq7ioZWPAYT696Weg0c*/
  /*private oauthService: OAuthService = inject(OAuthService);

  private configure() {

    console.log(JSON.stringify(authConfig));
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh(); // Optional: for refreshing tokens
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  public login() {
    this.oauthService.initCodeFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  public get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }*/


}
