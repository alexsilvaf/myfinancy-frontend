import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material/material.module';
import { NgChartsModule } from 'ng2-charts';
import { CurrencyValuePipe } from 'app/pipes/currency-value.pipe';
import { NumberValuePipe } from 'app/pipes/number-value.pipe';

const COMPONENTS = [
  HomeComponent,
  SidebarComponent,
]

@NgModule({
  declarations: [
    CurrencyValuePipe,
    NumberValuePipe,
    COMPONENTS,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    NgChartsModule,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class ComponentModule { }
