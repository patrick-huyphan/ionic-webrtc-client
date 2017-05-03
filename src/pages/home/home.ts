import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import * as Peer from 'simple-peer';
import { Remote } from '../remote/remote';

const VIDEO_CONSTRAINTS = {
  audio: true,
  video: {
    width: 640,
    frameRate: 15
  }
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {
  @ViewChild('localVideo') localVideo;

  private peer;
  private connectionString = 'asdasdasd';

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController
  ) {
    navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS)
    .then((stream) => {
      this.peer = new Peer({
        initiator: this.viewCtrl.name === 'HomePage',
        trickle: false,
        stream,
      });

      this.peer.on('signal', (data) => {
        // persist data on DB
        this.connectionString = JSON.stringify(data);
        console.log(this.connectionString);
      })

      this.peer.on('stream', (stream) => {
        this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
        this.localVideo.nativeElement.play();
      })
    });
  }

  ngOnDestroy() {
    // remove data from DB
  }

  connect(event: HTMLTextAreaElement) {
    this.peer.signal(JSON.parse(event.value));
  }

  toRemote() {
    this.navCtrl.push(Remote);
  }
}
