import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
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

    // this.recorder.onstart = (evt) => {
    //   console.log('recording started: ', evt);
    //   // display controls for pause and stop
    //   this.isRecording = true;
    // }
    // this.recorder.onstop = (evt) => {
    //   console.log('recording stopped: ', evt);
    //   this.isRecording = false;
    //  };
    this.recorder.start();
    // console.log('recorder state: ', this.recorder.state);
    // if (Array.isArray(this.stream)) {
    // this.recorder = new RecordRTC(this.stream);
    // this.recorder.startRecording();
    // this.isRecording = true;
    // } else {
    //   // this.recorder = new RecordRTC(this.stream)
    //   this.recorder = new RecordRTC(this.stream, { type: 'video', recorderType: MediaStreamRecorder });
    //   this.recorder.startRecording();
    //   console.log('start recording');
    //   this.isRecording = true;
    // }
  }
  stopRecording() {
    // this.recorder?.stopRecording(() => {
    //   this.videoBlob = this.recorder.getBlob();
    //   console.log(' blob: ', this.videoBlob);

    //   const videoUrl = URL.createObjectURL(this.videoBlob);

    //   this.videoUrlSub.next(videoUrl);
    // });
    console.log('stop recording called');

    this.recorder?.stop();

    this.showPreview = true;
    this.recorder!.ondataavailable = async (event) => {
      console.log('stream recorded: ', event)
      this.chunks.push(event.data);

      const videoUrl = URL.createObjectURL(event.data);
      this.videoUrlSub.next(videoUrl);
      this.videoBlob = new Blob(this.chunks, { type: "video/mp4;" });

      this.chunks = [];
      // this.stream.getTracks()[0].stop();
      this.type = ''
    }

    // });



  }

  resumeRecording() {
    // this.recorder?.resumeRecording();
    this.recorder?.resume();
  }
  downloadRecording() {
    saveAs(this.videoBlob, "awesomevideo.mp4");
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
