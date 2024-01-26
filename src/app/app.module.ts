import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentModule } from './components/component.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LayoutsModule } from './layouts/layouts.module';
import { provideNgxMask } from 'ngx-mask';
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentModule,
    LayoutsModule,
  ],
  providers: [
    AuthInterceptorProvider,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideNgxMask(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
