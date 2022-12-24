import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VideoStreamMerger } from 'video-stream-merger';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {
  stream!: MediaStream;
  @Output() emitStream = new EventEmitter<MediaStream>();
  @Output() emitStop = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {

    console.log('constraints: ',)
    this.startMedia();
  }
  async startMedia() {
    const screen = await navigator.mediaDevices.getDisplayMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, });
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, });

    // videoRefs
    const screenShareVideoRef: HTMLVideoElement = document.createElement('video');
    // let webcamVideoRef = document.createElement('video');
    screenShareVideoRef.srcObject = screen;


    console.log('stream in screen: ', navigator.mediaDevices.getSupportedConstraints());
    // this.emitStream.emit(screen)
    // this.stream = new MediaStream([ ...micStream.getTracks(),...screen.getTracks(),])

    //   this.stream = merger.result;
    this.emitStream.emit(new MediaStream([...micStream.getTracks(), ...screen.getTracks(),]));

    screen.getTracks()[0].onended = (evt) => {
      console.log('screen share stopped: ', evt);
      alert('screen recording has stopped. click on stop button to preview your recording for downloads')
      this.emitStop.emit('stop');
      // webcamVideoRef.pause();
      // webcamVideoRef.hidden = true;
    }

    // reference to your canvas node, might vary depending on your setup
    // const canvas = document.createElement("canvas");
    // // and get the 2D rendering context for the canvas
    // const ctx = canvas?.getContext("2d");

    // // kick off the drawing process
    // const startDrawing = () => {
    //   requestAnimationFrame(loop);
    // }

    // // requestAnimationFrame loop. Each frame, we draw to the canvas.
    // const loop = () => {
    //   draw();
    //   requestAnimationFrame(loop);
    // }

    // // our drawing function
    // const draw = () => {
    //   if (canvas) {
    //     const { width, height } = canvas;
    //     // clear out the entire canvas and paint from scratch
    //     ctx?.clearRect(0, 0, width, height);

    //     // draw our screen share in top-left
    //     // would need to do real math to get proper aspect ratio.
    //     ctx?.drawImage(screenShareVideoRef, 0, 0, 500, 400);

    //     // draw our webcam in bottom right.
    //     // would need to do real math to get proper aspect ratio.
    //     ctx?.drawImage(webcamVideoRef, width - 50, height - 50, 30, 30);


    //     // get frequencies
    //     analyserNode.getByteFrequencyData(frequencies)
    //     // let's loop through our frequencies and draw a vertical bar for each
    //     const barWidth = width / frequencies.length;
    //     for (let i = 0; i < frequencies.length; i++) {
    //       const x = i * barWidth;
    //       const y = (1 - frequencies[i] / 1000) * height;

    //       ctx?.fillRect(x, y, barWidth, height - y);
    //     }
    //   }
    // }


    // // create our audio context
    // const audioCtx = new AudioContext();

    // // 💡 create an analyser node with some options set
    // const analyserNode = audioCtx.createAnalyser();
    // analyserNode.fftSize = 128;
    // analyserNode.minDecibels = -90;
    // analyserNode.maxDecibels = -15;

    // // 💡 turn our earlier mic MediaStream into an AudioNode and connect to analyser
    // const micSourceNode = audioCtx.createMediaStreamSource(micStream);
    // micSourceNode.connect(analyserNode);

    // // we'll hold our frequencies in a typed array
    // let frequencies = new Uint8Array(analyserNode.frequencyBinCount);

    // startDrawing();

    // const canvasStream = canvas?.captureStream(30);

    // // combine the canvas stream and mic stream (from above) by collecting
    // //  tracks from each.
    // if (canvasStream) {
    //   const combinedStream = new MediaStream([
    //     ...canvasStream.getTracks(),
    //     ...micStream.getTracks()
    //   ]);
    //   this.emitStream.emit(combinedStream);
    //   // document.getElementById('holder')?.append(canvas);
    //   console.log('combined stream: ', combinedStream);

    // }
  }
  // }, 5000);



}
// video: { echoCancellation: true, noiseSuppression: true, facingMode: 'user' }
