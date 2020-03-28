import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {ChirpService} from '../services/chirp.service';
import {MatSnackBar} from '@angular/material';
import {ApiService} from '../services/api.service';
import {AesService} from '../services/aes.service';
import {Buffer} from 'buffer';
import {expandNodes} from '@angular/compiler/src/ml_parser/icu_ast_expander';
import {async} from 'q';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  // maxSendLength = 32;
  sendText = new FormControl('', [Validators.required]); // Validators.maxLength(this.maxSendLength)
  constructor(private chirp: ChirpService,
              private snackbar: MatSnackBar,
              private api: ApiService,
              private aes: AesService) { }

  ngOnInit() {
  }

  onClickButtonSend = async () => {
    if (this.sendText.invalid) {
      this.snackbar.open('Invalid text', null, {duration: 2000});
      return;
    }
    const text = this.sendText.value;
    const snippetPayload = await this.aes.encrypt(text);
    this.snackbar.open('Transmitting message...', null, {duration: 2000});
    this.api.postSnippet({id: null, content: snippetPayload.ivCipherText})
      .subscribe((data: string) => {
        if (data === '') {
          this.snackbar.open('Error sending temporary data to the server, please check your internet connection', null, {duration: 2000});
        } else {
          const buffer = Buffer.alloc(4);
          buffer.writeInt32BE(parseInt(data, 10), 0);
          const id = Uint8Array.from(buffer);
          const chirpPayload = Uint8Array.of(...snippetPayload.key, ...id); // 16 byte key + 4 byte int in big endian
          this.chirp.send(chirpPayload, error => {
            if (error != null) {
              console.error(error);
              this.snackbar.open('Error transmitting message', null, {duration: 2000});
            } else {
              console.log('Chirp sent!');
            }
          });
        }
      });

  }
}
