import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import fixWebmDuration from 'fix-webm-duration';
import { Subject } from 'rxjs';
import { RecordingDialogComponent } from '../recording-dialog/recording-dialog.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  type = '';
  stream!: MediaStream;
  // recorder!: MediaRecorder;
  recorder!: MediaRecorder;
  isRecording = false;
  counter = 0;
  showPreview: boolean = false;
  chunks: Array<Blob> = [];
  streamSub = new Subject<MediaStream>();
  videoUrlSub: Subject<string> = new Subject();
  videoBlob!: Blob;
  serverPushInterval!: NodeJS.Timer;
  STREAM_NAME!: string | number;
  startTime!: number;
  stopTime!: number;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    console.log('stream: ', this.stream);

    if (this.stream) {
      console.log('stream: ', this.stream);
    }


  }
  getStream(stream: MediaStream) {
    this.stream = stream;
    console.log('stream in container: ', stream);
    this.dialog.open(RecordingDialogComponent, { backdropClass: 'transparent', hasBackdrop: true }).afterClosed().subscribe(result => {
      if (result.start) {
        // start recording
        console.log('starting meeting: ', result);
        this.startRecording();
        if (this.type == 'webcam') {
          this.streamSub.next(stream)
        }
      }
    });
  }
  chooseType(type: string) {
    console.log('type: ', type)
    this.type = type;

  }
  startRecording() {
    this.startTime = performance.now();
    this.STREAM_NAME = this.getName();
    console.log('starting recording called: ', this.stream);

    this.recorder = new MediaRecorder(this.stream);

    this.recorder?.addEventListener('start', (evt) => {
      console.log('recording started 1: ', evt);
      this.isRecording = true;
    })
    this.recorder?.addEventListener('stop', (evt) => {
      console.log('recording stopped 1: ', evt);
      this.isRecording = false;


    })


    this.recorder.start();

    // this.serverPushInterval = setInterval(() => {
    //   if (this.recorder!.state == 'recording') {
    //     this.recorder?.requestData();
    //   }
    //   this.recorder!.ondataavailable = (evt) => {
    //     this.chunks.push(evt.data);
    //     const blob = new Blob(this.chunks, { type: "video/mp4;" });
    //     // this.sendFile(evt.data)
    //     // this.downloadRecording(blob);
    //   }
    // }, 4000)

  }
  sendFile(file: Blob) {
    try {
      console.log('sending file to server');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', this.STREAM_NAME.toString());
      // formData.append('chunk', chunkNumber);
      fetch('http://localhost:4000/upload', {
        method: 'PUT',
        body: formData
      });
    } catch (error) {
      console.log('error: ', error);

    }
  }
  getName() {
    return +new Date()
  }

  stopRecording() {
    this.stopTime = performance.now();
    console.log('stop recording called');

    this.recorder?.stop();

    this.showPreview = true;
    this.recorder!.ondataavailable = async (event) => {
      console.log('stream recorded: ', event)
      if (event.data)
        this.chunks.push(event.data);

      const videoUrl = URL.createObjectURL(event.data);
      this.videoUrlSub.next(videoUrl);

      this.videoBlob = new Blob(this.chunks, { type: "video/webm;" });

      const duration = this.stopTime - this.startTime;
      console.log('duration: ', duration);

      // this.videoBlob = await this.patchBlob(blob, duration);
      this.chunks = [];
      // this.stream.getTracks()[0].stop();
      this.type = '';
      setTimeout(() => {
        clearInterval(this.serverPushInterval);
      }, 4000);

      this.stream.getTracks()[0].stop();
    }

    // });



  }
  patchBlob(blob: Blob, duration: number): Promise<Blob> {
    return new Promise(resolve => {
      fixWebmDuration(blob, duration, newBlob => resolve(newBlob));
    });
  }
  resumeRecording() {
    // this.recorder?.resumeRecording();
    this.recorder?.resume();
  }
  downloadRecording(blob?: Blob) {
    saveAs(blob ? blob : this.videoBlob, "awesomevideo.mp4");
  }

  shareRecording() { }
  pauseRecording() {
    // this.recorder?.pauseRecording();
    this.recorder?.pause();
  }
  getRecordingActions(action: string) {
    console.log('actions: ', action);
    switch (action) {
      case 'stop':
        this.stopRecording();
        break;
      case 'resume':
        this.resumeRecording()
        break;
      case 'pause':
        this.pauseRecording();
        break;
      default:
        break;
    }
  }
}
