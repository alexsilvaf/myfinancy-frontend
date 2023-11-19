import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';

const MATERIAL_COMPONENTS = [
  FormsModule,
  MatTooltipModule,
]

@NgModule({
  imports: [
    MATERIAL_COMPONENTS,
  ],
  exports: [
    MATERIAL_COMPONENTS,
  ]
})
export class MaterialModule { }
