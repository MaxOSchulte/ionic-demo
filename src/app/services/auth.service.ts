import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = false;

  constructor(private readonly platform: Platform, private readonly fingerprintAio: FingerprintAIO) {
  }

  async authenticate(): Promise<boolean> {
    try {
      // TODO implement some authentication logic. E.g. FingerprintAIO
      if (this.platform.is('hybrid') && (await this.fingerprintAio.isAvailable())) {
        this.authenticated = await this.fingerprintAio.show({
          title: 'Please authenticate',
          description: 'Face ID and Fingerprint authentication',
        });
      } else {
        // Fallback to e.g. web authentication
        this.authenticated = true;
      }

    } catch (e) {
      console.error('authentication failed', e);
    }
    return this.authenticated;
  }
}
