import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {

  constructor(private router: Router) { }

  get isLoginRoute() {
    return this.router.url === '/login';
  }
}
