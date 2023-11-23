import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageAssetsComponent } from './components/manage-assets/manage-assets.component';
import { UserAccountComponent } from './components/user-account/user-account.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }, {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'management',
    component: ManageAssetsComponent
  }, {
    path: 'account',
    component: UserAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
