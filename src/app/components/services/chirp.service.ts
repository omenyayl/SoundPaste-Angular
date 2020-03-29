import { Injectable } from '@angular/core';
import { CHIRP_SET } from '../../environment';
import { Buffer } from 'buffer';
import {ApiService} from './api.service';
import {Snippet} from '../types/Snippet';
import {AesService} from './aes.service';

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
  constructor(private api: ApiService,
              private aes: AesService) {
    Chirp({
      key: CHIRP_SET,
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
    // this.onChirpReceived(Uint8Array.from([0, 0, 0, 0, 0, 126, 201, 1])); // 8308993
    // this.onChirpReceived(Uint8Array.from([0, 0, 0, 0, 0, 127, 88, 10]));
  }

  /**
   * Called when chirp decoded a chirp from the microphone
   * @param data The decoded data from a chirp
   */
  onChirpReceived(data: Uint8Array) {
    if (data.length > 0) {
      // console.log(`chirp data: ${data}`);
      const key = data.slice(0, 16);
      const idBytes = data.slice(16, data.length);
      const id = Buffer.from(idBytes).readUInt32BE(0);
      this.api.getSnippet(id).subscribe(s => {
        const ivCipherText = Uint8Array.from(atob(s.content), c => c.charCodeAt(0));
        const iv = ivCipherText.slice(0, 16);
        const cipherText = ivCipherText.slice(16, ivCipherText.length);
        this.aes.decrypt(cipherText, key, iv).then((message) => {
          for (const listener of this.listeners) {
            listener(message);
          }
        }).catch(e => {
          console.error(e);
        });
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
  send(data: Uint8Array, err: (error: Error) => void) {
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
  isSending(): boolean {
    return this.sdk.getState() === 3;
  }
}
