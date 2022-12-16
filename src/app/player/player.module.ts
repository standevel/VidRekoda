import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player/player.component';


@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule, MaterialModule
  ],
  exports: [PlayerComponent]
})
export class PlayerModule { }
