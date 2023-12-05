import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedUserLayoutComponent } from './logged-user-layout/logged-user-layout.component';
import { ComponentModule } from 'app/components/component.module';
import { AppRoutingModule } from 'app/app-routing.module';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { MaterialModule } from 'app/material/material/material.module';

const COMPONENTS = [
  LoggedUserLayoutComponent,
  LoginLayoutComponent,
]

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    ComponentModule,
    MaterialModule,
    AppRoutingModule,
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class LayoutsModule { }
