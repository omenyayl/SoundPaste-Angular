import { Injectable } from '@angular/core';
import { CHIRP_KEY } from '../../environment';
import { Buffer } from 'buffer';
import {ApiService} from './api.service';
import {Snippet} from '../types/Snippet';

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
  constructor(private api: ApiService) {
    Chirp({
      key: CHIRP_KEY,
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
   * @param num The number to convert
   * @return an array of unsigned integers
   */
  static longToUInt8Array(num: number): Uint8Array {
    const len = 8;
    const a = new Uint8Array(len);

    for (let i = 0; num !== 0 && i < len; i++) {
      // tslint:disable-next-line:no-bitwise
      a[len - i - 1] = num & 0xff;
      // tslint:disable-next-line:no-bitwise
      num >>= 8;
    }
    return a;
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
    // this.onChirpReceived(Uint8Array.from([0, 0, 0, 0, 0, 126, 201, 1])); // 8308993
    this.onChirpReceived(Uint8Array.from([0, 0, 0, 0, 0, 127, 88, 10]));
  }

  /**
   * Called when chirp decoded a chirp from the microphone
   * @param data The decoded data from a chirp
   */
  onChirpReceived(data: Uint8Array) {
    if (data.length > 0) {
      // const asciiData = ChirpSDK.toAscii(data);
      console.log(`chirp data: ${data}`);
      const id = Buffer.from(data).readUInt32BE(4);
      this.api.getSnippet(id).subscribe(s => {
        console.log('Chirp received: ' + id);
        console.log('Data received: ' + s.content);
        for (const listener of this.listeners) {
          listener(s.content);
        }
      });
    } else {
      console.log('Chirp decode failed');
    }
  }

  /**
   * Subscribe to received chirps via microphone
   * @param listener Callback that is called whenever Chirp encounters outside transmissions
   */
  subscribe(listener: (data: any) => void) {
    this.listeners.push(listener);
  }

  /**
   * Send the given data
   * @param data The string data to send via sound
   * @param err Error callback, which is non-null if there is an error
   */
  send(data: (string | number), err: (error: Error) => void) {
    let error: Error = null;
    if (this.sdk == null) {
      error = new Error('Chirp SDK failed initialization.');
    } else {
      const rc = this.sdk.send(typeof data === 'string' ? data : ChirpService.longToUInt8Array(data));
      if (rc !== 0) {
        error = new Error(this.sdk.errorToString(rc));
      }
    }
    err(error);
  }
}
