import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {
  @Output() emitStart = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  startRecording() { this.emitStart.emit(); }

}
