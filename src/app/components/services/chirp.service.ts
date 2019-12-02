import { Injectable } from '@angular/core';
import { CHIRP_SECRET } from '../../environment';

declare var ChirpSDK: any; // declaration to use the external chirp SDK script
const Chirp = ChirpSDK.Chirp; // comes from the external chirp SDK script

@Injectable({
  providedIn: 'root'
})

/**
 * Service that handles transmitting/receiving data over sound using Chirp SDK (see https://chirp.io)
 */
export class ChirpService {
  listeners = [];
  sdk = null;
  constructor() {
    Chirp({
      key: CHIRP_SECRET,
      onReceived: this.onChirpReceived.bind(this)
    }).then(this.onChirpInit.bind(this))
      .catch(ChirpService.onChirpError);
  }

  /**
   * Called when chirp encounters an error
   * @param error The error from chirp
   */
  static onChirpError(error) {
    if (error) {
      console.error('Chirp error:', error);
    }
  }

  /**
   * Called when chirp initializes
   * @param sdk Chirp sdk
   */
  onChirpInit(sdk) {
    sdk.start()
      .then(() => this.onChirpStart(sdk))
      .catch(ChirpService.onChirpError);
  }

  /**
   * Called when chirp starts
   * @param sdk The chirp sdk
   */
  onChirpStart(sdk) {
    this.sdk = sdk;
  }

  /**
   * Called when chirp decoded a chirp from the microphone
   * @param data The decoded data from a chirp
   */
  onChirpReceived(data: Uint8Array) {
    if (data.length > 0) {
      const asciiData = ChirpSDK.toAscii(data);
      console.log('Chirp received: ' + asciiData);
      for (const listener of this.listeners) {
        listener(asciiData);
      }
    } else {
      console.log('Chirp decode failed');
    }
  }

  /**
   * Subscribe to received chirps via microphone
   * @param listener Callback that is called whenever Chirp encounters outside transmissions
   */
  subscribe(listener: (data: string) => void) {
    this.listeners.push(listener);
  }

  /**
   * Send the given data
   * @param data The string data to send via sound
   * @param err Error callback, which is non-null if there is an error
   */
  send(data: string, err: (error: Error) => void) {
    let error: Error = null;
    if (this.sdk == null) {
      error = new Error('Chirp SDK failed initialization.');
    } else {
      const rc = this.sdk.send(data);
      if (rc !== 0) {
        error = new Error(this.sdk.errorToString(rc));
      }
    }
    err(error);
  }
}
