import {Component, NgZone, OnInit} from '@angular/core';
import {ChirpService} from '../services/chirp.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
  chirps: string[] = [];
  constructor(private chirp: ChirpService,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.chirp.subscribe((data: string) => {
      this.ngZone.run(() => {
        this.chirps.push(data);
      });
    });
  }

}
