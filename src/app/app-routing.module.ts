import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageAssetsComponent } from './components/manage-assets/manage-assets.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth-guard';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoggedUserLayoutComponent } from './layouts/logged-user-layout/logged-user-layout.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', 
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterAccountComponent}
    ]
  },
  {
    path: '',
    component: LoggedUserLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'management', component: ManageAssetsComponent },
      { path: 'account', component: UserAccountComponent }
    ]
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
