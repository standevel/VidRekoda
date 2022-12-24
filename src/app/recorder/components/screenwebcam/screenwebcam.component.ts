
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
      const webcam = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: { echoCancellation: true, noiseSuppression: true }, });
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });

      // videoRefs
      const screenShareVideoRef: HTMLVideoElement = document.createElement('video');
      let webcamVideoRef = document.createElement('video');
      // webcamVideoRef.disablePictureInPicture = false;
      // screenShareVideoRef.srcObject = screen;
      webcamVideoRef.srcObject = webcam;
      webcamVideoRef.muted = true;
      document.getElementById('holder')?.append(webcamVideoRef);
      webcamVideoRef.width = 0;

      webcamVideoRef.play();


      webcamVideoRef.onloadeddata = async (evt) => {
        console.log('event on loaded metadata: ', evt)



        document.addEventListener('mouseover', () => {
          console.log('mouse over document');

          webcamVideoRef.requestPictureInPicture().then(d => {
            // console.log('pip window: ', d);

          }).catch(err => console.log('pip error: ', err.message)
          );

        })

        window.addEventListener('beforeunload', function (e) {
          var myPageIsDirty = '...' //you implement this logic...
          if (myPageIsDirty) {
            //following two lines will cause the browser to ask the user if they
            //want to leave. The text of this dialog is controlled by the browser.
            e.preventDefault(); //per the standard
            e.returnValue = ''; //required for Chrome
          }
          //else: user is allowed to leave without a warning dialog
        });



        console.log('stream in screen: ', navigator.mediaDevices.getSupportedConstraints());

        const stream = new MediaStream([...screen.getTracks(), ...micStream.getTracks(),])

        this.emitStream.emit(stream);

        screen.getTracks()[0].onended = (evt) => {
          console.log('screen share stopped: ', evt);
          alert('screen recording has stopped. Click on stop button to preview your recording for downloads')
          this.emitStop.emit('stop');
          webcamVideoRef.pause();
          webcamVideoRef.hidden = true;
        }



      }
    } catch (err) {
      console.log('error: ', err);

    }
  }
}
