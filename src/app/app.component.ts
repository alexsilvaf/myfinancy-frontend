import { Component, HostListener, OnInit } from '@angular/core';
import { UserModel } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isMobileMenu: boolean;
  loggedUser: UserModel | null;

  constructor(private authService: AuthService) {
  }

  ngOnInit(){
    this.authService.loggedUser$.subscribe(user => {
      this.loggedUser = user;
    });
  }
}
