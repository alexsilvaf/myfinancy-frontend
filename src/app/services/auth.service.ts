import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'app/models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedUserSubject = new BehaviorSubject<UserModel | null>(null);
  loggedUser$ = this.loggedUserSubject.asObservable();

  constructor(private router: Router) {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      this.loggedUserSubject.next(JSON.parse(userData));
    }
  }

  login(user: UserModel) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    this.loggedUserSubject.next(user);
    this.router.navigate(['home']);
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.loggedUserSubject.next(null);
    this.router.navigate(['login']);
  }

  getLoggedUser() {
    return this.loggedUserSubject.value;
  }
}
