import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private client_id = '019cf354-99fe-7116-b8cd-c0a3a648e102';
  private redirectUri = 'http://localhost:4200/oauth/callback';
  private responseType = 'code';
  private http = inject(HttpClient);
  private baseAuthorizationUrl: string = 'http://localhost:9001/oauth/authorize';
  private tokenUrl: string = 'http://localhost:9001/oauth/token';
  private authToken = {};
  constructor() { }

  generateCodeVerifierAndChallenge = ()=> {
    // 1. Create a random string (code_verifier) between 43 and 128 characters long
    const generateCodeVerifier = () => {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
      const randomValues = crypto.getRandomValues(new Uint8Array(128)); // 128 bytes of random data
      return Array.from(randomValues).map(byte => possible[byte % possible.length]).join('');
    };

    // 2. Hash the code_verifier using SHA256 and Base64 URL-encode it (code_challenge)
    const sha256 = async (plain: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return await crypto.subtle.digest('SHA-256', data);
    };

    const base64urlEncode = (buffer: ArrayBuffer) => {
      let encoded = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
      // Replace non-url-safe characters
      encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return encoded;
    };

    const codeVerifier = generateCodeVerifier();

    return sha256(codeVerifier).then(buffer => {
      const codeChallenge = base64urlEncode(buffer);
      return { codeVerifier, codeChallenge };
    });
  };

  async loginWithPKCE() {
    const { codeVerifier, codeChallenge } = await this.generateCodeVerifierAndChallenge();

    // Store the code verifier securely
    localStorage.setItem('code_verifier', codeVerifier);

    // Build the authorization URL
    const clientId = this.client_id; // Replace with your Laravel Passport client ID
    const redirectUri = 'http://localhost:4200/oauth/callback'; // Replace with your registered redirect URI
    const responseType = 'code';
    const scope = ''; // Add scopes if needed
    const state = codeVerifier; // Generate a random state and store it too

    const authorizationUrl = `http://localhost:9001/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=${responseType}&` +
      `scope=${scope}&` +
      `state=${state}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`; // Laravel Passport uses S256 method

    localStorage.setItem(state, JSON.stringify({
      'id': state,
      'client_id': this.client_id,
      'code_verifier': codeVerifier,
      'challenge': codeChallenge
    }));
    // Redirect the user to the Laravel authorization endpoint
    window.location.href = authorizationUrl;
  }


  async handleCallback(code: string, state: string, code_verifier: string, router: Router, route:  ActivatedRoute) {

    console.log('Code sent by server: ' + code);
    console.log('State sent by server: ' + state);
    console.log('Code verifier get from local storage: ' + code_verifier);

    // Verify the state parameter against the stored state (omitted for brevity)

    /*const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      // Handle error
      return;
    }*/

    const clientId = this.client_id;
    const redirectUri = this.redirectUri;

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', clientId);
    body.set('redirect_uri', redirectUri);
    body.set('code', code);
    body.set('code_verifier', code_verifier); // Send the original verifier, not the challenge

    this.http.post(`${this.tokenUrl}`, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).subscribe({complete: () => console.log('completed'), next: (response)=> {
      // Store the access token and complete the login process
      console.log("TOKEN: " + JSON.stringify(response));
      this.authToken = Object.assign({}, response);
      router.navigate(['/home', {relativeTo: route.parent}]);
    }, error: (error)=> {
      console.error(error);
    }});
  }

  getAccessToken():Object{
    return this.authToken;
  }


  /******************************************************************************************************************

   No reactive code

   */


  generateCodeVerifier():string{
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = crypto.getRandomValues(new Uint8Array(128)); // 128 bytes of random data
    return Array.from(randomValues).map(byte => possible[byte % possible.length]).join('');
  }

  async  sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest('SHA-256', data);
  }


  async base64urlEncode(buffer: ArrayBuffer){
    let encoded = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
    // Replace non-url-safe characters
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return encoded;
  }

  async generateChallenge(codeVerifier: string): Promise<string>{
    //const codeVerifier = this.generateCodeVerifier();
    return await this.base64urlEncode(await this.sha256(codeVerifier));
  }

  async requestCodePKCE() {
    let codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateChallenge(codeVerifier);
    // Store the code verifier securely
    localStorage.setItem('code_verifier', codeVerifier);
    // Build the authorization URL
    const clientId = this.client_id; // Replace with your Laravel Passport client ID
    const redirectUri = this.redirectUri;//'http://localhost:4200/oauth/callback'; // Replace with your registered redirect URI
    const responseType = this.responseType;//'code';
    const scope = ''; // Add scopes if needed
    const state = codeVerifier; // Generate a random state and store it too
    const authorizationUrl = `${this.baseAuthorizationUrl}?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=${responseType}&` +
      `scope=${scope}&` +
      `state=${state}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`; // Laravel Passport uses S256 method

    localStorage.setItem(state, JSON.stringify({
      'id': state,
      'client_id': this.client_id,
      'code_verifier': codeVerifier,
      'challenge': codeChallenge
    }));
    // Redirect the user to the Laravel authorization endpoint
    window.location.href = authorizationUrl;
  }



  /*
  // Generate a secure random string for the code verifier
  private generateCodeVerifier(len: number): string {
    // Implementation for generating a high-entropy string (e.g., using window.crypto)
    // ...
    return this.generateSecureRandomString(len, this.alphanumericChars);

  }

  // Generate a code challenge from the code verifier (SHA256 hash, base64url encoded)
  private generateCodeChallenge(length: number): string {
    // Implementation for hashing and encoding
    // ...
    let codeChallengeEqualTrimed = this.trimEqual(btoa(this.hashData(this.generateCodeVerifier(length))));
    let codeChallengeTransformed = this.transform(codeChallengeEqualTrimed, '+', '-');
    console.log(codeChallengeTransformed);
    let codeChallenge = this.transform(codeChallengeTransformed, '/', '_');
    console.log(codeChallenge);
    return codeChallenge;
  }

  // Optional: A fallback using Math.random (less secure)
  private generateInsecureRandomString(length: number, alphanumericChars: string): string {
    //let alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charsLength = alphanumericChars.length;
    for (let i = 0; i < length; i++) {
      result += alphanumericChars[Math.floor(Math.random() * charsLength)];
    }
    return result;
  }
  public generateSecureRandomString(length: number, alphanumericChars: string): string {
    // Check for browser crypto support
    if (!window.crypto || !window.crypto.getRandomValues) {
      console.error('Cryptographically secure random number generator not supported in this browser. Falling back to less secure Math.random().');
      // A fallback could be implemented here using Math.random, but it's not recommended for security purposes.
      // For general use in an Angular app, you may want to ensure crypto is available.
      return this.generateInsecureRandomString(length, alphanumericChars);
    }
    let result = '';
    const charsLength = alphanumericChars.length;
    // Create a Uint8Array of the desired length to hold random bytes
    const randomBytes = new Uint8Array(length);

    // Fill the array with cryptographically secure random values
    window.crypto.getRandomValues(randomBytes);

    // Loop through the random bytes to build the string
    randomBytes.forEach((byte) => {
      // Use the modulo operator to map the random byte value to an index within our character set
      // This is necessary because the random byte can be up to 255, but the char set might be smaller.
      result += alphanumericChars[byte % charsLength];
    });

    return result;
  }

  hashData(data: string): string {
    const hashedPassword = CryptoJS.SHA256(data).toString();
    return hashedPassword;
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

  transform(value: string, from: string, to: string): string {
    // Use replaceAll for multiple occurrences, or just replace for the first
    return value.replaceAll(from, to);
  }*/
}
