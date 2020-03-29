import { Injectable } from '@angular/core';
import {SnippetPayload} from '../types/SnippetPayload';

const KEY_LENGTH = 16;
const CRYPTO_ALGORITHM = {name: 'AES-CBC', length: KEY_LENGTH * 8};

@Injectable({
  providedIn: 'root'
})
export class AesService {
  constructor() {
    GibberishAES.size(128);
  }
  encrypt(data: string): Promise<SnippetPayload> {
    return new Promise<SnippetPayload>(async (resolve) => {
      const iv = window.crypto.getRandomValues(new Uint8Array(KEY_LENGTH));
      const encoder = new TextEncoder();
      const message = encoder.encode(data);

      const key = await window.crypto.subtle.generateKey(
        CRYPTO_ALGORITHM,
        true,
        ['encrypt', 'decrypt']
      );
      const cipherText = new Uint8Array(await window.crypto.subtle.encrypt({name: 'AES-CBC', iv}, key, message));
      const exportedKey = new Uint8Array(await window.crypto.subtle.exportKey('raw', key));
      // console.log(`key: ${exportedKey}`);
      // console.log(`iv: ${iv}`);
      // console.log(`cipherText: ${cipherText}`);
      const ivCipherText = btoa(String.fromCharCode(...iv, ...cipherText)); // 16 byte iv + n byte cipherText
      resolve({ivCipherText, key: exportedKey} as SnippetPayload);
    });
  }
  decrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const aesKey = await window.crypto.subtle.importKey('raw', key, CRYPTO_ALGORITHM, false, ['decrypt']);
      const decoder = new TextDecoder();
      let message;
      try {
        message = await window.crypto.subtle.decrypt(
          {
            name: 'AES-CBC',
            iv
          }, aesKey, data);
      } catch (e) {
        reject(e);
      }
      resolve(decoder.decode(message));
    });
  }
}
