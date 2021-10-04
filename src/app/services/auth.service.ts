import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = false;

  constructor() {}

  async authenticate(): Promise<boolean> {
    try {
      // TODO implement some authentication logic. E.g. FingerprintAIO
      this.authenticated = true;
    } catch (e) {
      console.error('authentication failed', e);
    }
    return this.authenticated;
  }
}
