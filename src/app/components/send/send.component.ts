import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {ChirpService} from '../services/chirp.service';
import {MatSnackBar} from '@angular/material';
import {ApiService} from '../services/api.service';

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
              private api: ApiService) { }

  ngOnInit() {
  }

  onClickButtonSend() {
    if (this.sendText.invalid) {
      this.snackbar.open('Invalid text', null, {duration: 2000});
      return;
    }
    this.snackbar.open('Transmitting message...', null, {duration: 2000});
    this.api.postSnippet({id: null, content: this.sendText.value})
      .subscribe((data: any) => {
        if (data === '') {
          this.snackbar.open('Error sending temporary data to the server, please check your internet connection', null, {duration: 2000});
        } else {
          this.chirp.send(data, error => {
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
