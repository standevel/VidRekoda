import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecordingDialogComponent } from '../recording-dialog/recording-dialog.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  type = 'webcam';
  stream!: MediaStream;
  recorder!: MediaRecorder;
  stopped = true;
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
      }
    });
  }
  chooseType(type: string) {
    console.log('type: ', type)
    this.type = type;

  }
  startRecording() {
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.start();

    if (this.recorder) {
      this.recorder!.onstart = (evt) => {
        console.log('recording started: ', evt);
        // display controls for pause and stop
      }
      this.recorder!.onstop = (evt) => {
        console.log('recording stopped: ', evt);
        // save recording
      }
    }
  }
  stopRecording() {
    this.recorder?.stop();
  }
  downloadRecording() { }
  shareRecording() { }
}
