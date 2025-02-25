import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.css']
})
export class FabComponent implements OnInit {
  @Output() choiceEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    console.log('fab buttons')
  }

  chooseOption(source: string) {
    this.choiceEvent.emit(source);
  }

  openSettings() { }
}
