import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {
  stream!: MediaStream;
  @Output() emitStream = new EventEmitter<MediaStream>();
  constructor() { }

  ngOnInit() {

    console.log('constraints: ',)
    this.startMedia();
  }
  async startMedia() {
    this.stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, });

    console.log('stream in screen: ', this.stream);
    this.emitStream.emit(this.stream);

  }
  startRecording() {
    console.log(' starting ');

    this.emitStream.emit(this.stream);
  }
}

