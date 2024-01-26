import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageAssetsComponent } from './components/manage-assets/manage-assets.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { LoginComponent } from './components/login/login.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoggedUserLayoutComponent } from './layouts/logged-user-layout/logged-user-layout.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LoginLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterAccountComponent }
    ]
  },
  {
    path: '',
    component: LoggedUserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'management', component: ManageAssetsComponent },
      { path: 'account', component: UserAccountComponent }
    ]
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
