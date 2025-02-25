

import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent implements OnInit {



  stream!: MediaStream;
  @Output() emitStream = new EventEmitter<MediaStream>();
  @Output() emitStop = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {

    console.log('constraints: ',)
    this.startMedia();
  }
  async startMedia() {
    // const screen = await navigator.mediaDevices.getDisplayMedia({ audio: { echoCancellation: true, noiseSuppression: true }, });
    const webcam = await navigator.mediaDevices.getUserMedia({ video: { echoCancellation: true, noiseSuppression: true }, });
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, });

    // videoRefs
    const screenShareVideoRef: HTMLVideoElement = document.createElement('video');
    let webcamVideoRef = document.createElement('video');
    // screenShareVideoRef.srcObject = screen;
    webcamVideoRef.srcObject = webcam;
    webcamVideoRef.muted = true;
    webcamVideoRef.play();
    // document.getElementById('holder')?.append(webcamVideoRef);

    // webcamVideoRef.onloadeddata = async (evt) => {
    //   console.log('event: ', evt)
    //   const pip = await webcamVideoRef.requestPictureInPicture();

    // }

    console.log('stream in screen: ', navigator.mediaDevices.getSupportedConstraints());

    this.stream = new MediaStream([...webcam.getTracks(), ...micStream.getTracks()])

    this.emitStream.emit(this.stream);




  }


}
// video: { echoCancellation: true, noiseSuppression: true, facingMode: 'user' }
