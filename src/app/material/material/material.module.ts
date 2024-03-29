import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';

const MATERIAL_COMPONENTS = [
  FormsModule,
  MatTooltipModule,
  MatTableModule,
  MatIconModule,
  MatTabsModule,
  ReactiveFormsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  BrowserAnimationsModule,
  MatMenuModule,
  MatCardModule,
  MatDividerModule,
  MatCheckboxModule,
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
