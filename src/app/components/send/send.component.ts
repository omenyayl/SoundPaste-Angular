import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {ChirpService} from '../services/chirp.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  maxSendLength = 32;
  sendText = new FormControl('', [Validators.required, Validators.maxLength(this.maxSendLength)]);
  constructor(private chirp: ChirpService) { }

  ngOnInit() {
  }

  onClickButtonSend() {
    if (this.sendText.invalid) { return; }
    this.chirp.send(this.sendText.value, error => {
      if (error != null) {
        console.error(error);
      } else {
        console.log('Chirp sent!');
      }
    });
  }
}
