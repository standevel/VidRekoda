import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MaterialModule } from "../material.module";
import { FabComponent } from "./fab/fab.component";

@NgModule({
    declarations: [
        FabComponent,
    ],
    imports: [CommonModule, MaterialModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    exports: [FabComponent]
})
export class SharedModule { }
