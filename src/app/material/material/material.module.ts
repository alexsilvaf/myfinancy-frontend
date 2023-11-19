import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';

const MATERIAL_COMPONENTS = [
  FormsModule,
  MatTooltipModule,
  MatTableModule,
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
