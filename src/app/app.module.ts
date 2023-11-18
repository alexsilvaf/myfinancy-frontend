import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NumberValuePipe } from './pipes/number-value.pipe';
import { ComponentModule } from './components/component.module';

@NgModule({
  declarations: [
    AppComponent,
    NumberValuePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
