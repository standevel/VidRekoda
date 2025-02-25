import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../material.module';
import { PlayerModule } from '../player/player.module';
import { SharedModule } from '../shared/shared.module';
import { ContainerComponent } from './components/container/container.component';
import { ControlsComponent } from './components/controls/controls.component';
import { ScreenComponent } from './components/screen/screen.component';
import { ScreenwebcamComponent } from './components/screenwebcam/screenwebcam.component';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { RecorderRoutingModule } from './recorder-routing.module';


@NgModule({
  declarations: [ContainerComponent,
    ScreenComponent,
    WebcamComponent,
    ScreenwebcamComponent,
    ControlsComponent,
    SettingsFormComponent
  ],
  imports: [
    CommonModule,
    RecorderRoutingModule,
    SharedModule,
    MaterialModule,
    PlayerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class RecorderModule { }
