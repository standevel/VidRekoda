import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recording-dialog',
  templateUrl: './recording-dialog.component.html',
  styleUrls: ['./recording-dialog.component.css']
})
export class RecordingDialogComponent implements OnInit {
  counter = 5;
  interval!: NodeJS.Timer;
  timer!: NodeJS.Timer
  constructor(@Inject(MatDialogRef) private dialogRef: MatDialogRef<RecordingDialogComponent>) { }

  ngOnInit() {
    this.interval = setInterval(() => {
      this.counter -= 1;
      if (this.counter == 0) {
        clearInterval(this.timer);
        this.dialogRef.close({ start: true })
      }
    }, 1000);
  }


}
