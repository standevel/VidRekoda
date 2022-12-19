import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  isPaused = false;
  @Output() emitAction: EventEmitter<string> = new EventEmitter();
  timerInterval!: NodeJS.Timeout;

  timer: number = 0;
  counterMessage!: string;
  constructor() { }

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.timer += 1;

      let hourStr = '';
      let minuteStr = '';
      let secondStr = '';

      let hour = Math.floor(this.timer / 3600)
      let minute = Math.floor((this.timer - hour * 3600) / 60)
      let seconds = this.timer - (hour * 3600 + minute * 60);

      hour < 10 ? hourStr = "0" + hour : hourStr = hour + '';
      minute < 10 ? minuteStr = "0" + minute : minuteStr = '' + minute;
      seconds < 10 ? secondStr = "0" + seconds : secondStr = '' + seconds;

      this.counterMessage = hourStr + ":" + minuteStr + ":" + secondStr;

    }, 1000);
  }
  resumeRecording() {
    this.emitAction.emit('resume');
    this.isPaused = false;
    this.timerInterval = setInterval(() => {
      this.timer += 1;

      let hourStr = '';
      let minuteStr = '';
      let secondStr = '';

      let hour = Math.floor(this.timer / 3600)
      let minute = Math.floor((this.timer - hour * 3600) / 60)
      let seconds = this.timer - (hour * 3600 + minute * 60);
      console.log(hour, minute, seconds)

      hour < 10 ? hourStr = "0" + hour : hourStr = hour + '';

      minute < 10 ? minuteStr = "0" + minute : minuteStr = '' + minute;

      seconds < 10 ? secondStr = "0" + seconds : secondStr = '' + seconds;

      this.counterMessage = hourStr + ":" + minuteStr + ":" + secondStr;

    }, 1000);
  }
  pauseRecording() {
    this.emitAction.emit('pause');
    this.isPaused = true;
    clearInterval(this.timerInterval);
  }
  stopRecording() {
    this.emitAction.emit('stop');
    clearInterval(this.timerInterval);
  }
  countTimer() {
    this.timer += 1;
    // console.log('counter: ', typeof this.timer,);

    let hourStr = '';
    let minuteStr = '';
    let secondStr = '';

    let hour = Math.floor(this.timer / 3600)
    let minute = Math.floor((this.timer - hour * 3600) / 60)
    let seconds = this.timer - (hour * 3600 + minute * 60);
    console.log(hour, minute, seconds)
    if (hour < 10)
      hourStr = "0" + hour;
    if (minute < 10)
      minuteStr = "0" + minute;
    if (seconds < 10)
      secondStr = "0" + seconds;

    this.counterMessage = hourStr + ":" + minuteStr + ":" + secondStr;

  }
}
