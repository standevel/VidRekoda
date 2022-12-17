
import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-screenwebcam',
  templateUrl: './screenwebcam.component.html',
  styleUrls: ['./screenwebcam.component.css']
})
export class ScreenwebcamComponent implements OnInit {


  stream!: MediaStream;
  @Output() emitStream = new EventEmitter<MediaStream>();
  @Output() emitStop = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {

    console.log('constraints: ',)
    this.startMedia();
  }
  async startMedia() {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ audio: { echoCancellation: true, noiseSuppression: true }, });
      const webcam = await navigator.mediaDevices.getUserMedia({ video: { echoCancellation: true, noiseSuppression: true }, });
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, });

      // videoRefs
      const screenShareVideoRef: HTMLVideoElement = document.createElement('video');
      let webcamVideoRef = document.createElement('video');
      screenShareVideoRef.srcObject = screen;
      webcamVideoRef.srcObject = webcam;
      webcamVideoRef.muted = true;
      document.getElementById('holder')?.append(webcamVideoRef);
      webcamVideoRef.width = 0;
      webcamVideoRef.play();

      webcamVideoRef.onloadeddata = async (evt) => {
        console.log('event: ', evt)
        webcamVideoRef.requestPictureInPicture().then((pip) => {

        }).catch(err => {
          setTimeout(() => {
            webcamVideoRef.requestPictureInPicture();
          }, 3000);
        });

      }

      console.log('stream in screen: ', navigator.mediaDevices.getSupportedConstraints());

      this.stream = new MediaStream([...screen.getTracks(), ...webcam.getTracks(), ...micStream.getTracks()])

      this.emitStream.emit(this.stream);

      screen.getTracks()[0].onended = (evt) => {
        console.log('screen share stopped: ', evt);
        alert('screen recording has stopped. click on stop button to preview your recording for downloads')
        // this.emitStop.emit('stop');
        webcamVideoRef.pause();
        // webcamVideoRef.hidden = true;
      }



    } catch (error: any) {
      console.log('err: ', error)
    }
  }
}
