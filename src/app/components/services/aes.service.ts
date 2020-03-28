import { Injectable } from '@angular/core';
import {SnippetPayload} from '../types/SnippetPayload';

const KEY_LENGTH = 16;

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
        {name: 'AES-CBC', length: KEY_LENGTH * 8},
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
  decrypt(data: string): string {
    return '';
  }
}
