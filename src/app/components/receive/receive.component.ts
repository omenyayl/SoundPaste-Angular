import {Component, NgZone, OnInit} from '@angular/core';
import {ChirpService} from '../services/chirp.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
  chirps: string[] = [];
  constructor(private chirp: ChirpService,
              private clipboard: Clipboard,
              private snackbar: MatSnackBar,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.chirp.subscribe((data: string) => {
      this.ngZone.run(() => {
        if (!data) {
          this.snackbar.open('Unable to process the message, check your internet connection.', null, {duration: 2000});
        } else {
          this.chirps.push(data);
          this.snackbar.open('Message Received', null, {duration: 2000});
        }
      });
    });
  }

  onClickCopyToClipboard(chirp: string) {
    if (this.clipboard.copy(chirp)) {
      this.snackbar.open('Copied the message to clipboard!', null, {duration: 2000});
    }
  }

}
