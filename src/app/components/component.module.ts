import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material/material.module';
import { NgChartsModule } from 'ng2-charts';
import { CurrencyValuePipe } from 'app/pipes/currency-value.pipe';
import { NumberValuePipe } from 'app/pipes/number-value.pipe';
import { ManageAssetsComponent } from './manage-assets/manage-assets.component';
import { DoubleNumberDirective } from 'app/directives/double-number.directive';
import { IntegerNumberDirective } from 'app/directives/integer-number.directive';
import { UserAccountComponent } from './user-account/user-account.component';
import { LoginComponent } from './login/login.component';
import { ManageAssetModalComponent } from './manage-asset-modal/manage-asset-modal.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { RecaptchaModule } from 'ng-recaptcha';

const COMPONENTS = [
  HomeComponent,
  SidebarComponent,
  ManageAssetsComponent,
  UserAccountComponent,
  LoginComponent,
  ManageAssetModalComponent,
]

@NgModule({
  declarations: [
    CurrencyValuePipe,
    NumberValuePipe,
    DoubleNumberDirective,
    IntegerNumberDirective,
    COMPONENTS,
    RegisterAccountComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    NgChartsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    RecaptchaModule,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class ComponentModule { }
