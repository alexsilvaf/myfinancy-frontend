import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let authenticated = this.authService.isAuthenticated();
    const targetRoute = state.url;

    // Se o usuário estiver autenticado e tentar acessar 'login' ou 'register',
    // redirecione para 'home'.
    if (authenticated && (targetRoute.startsWith('/login') || targetRoute.startsWith('/register'))) {
      this.router.navigate(['home']);
      return false;
    }

    // Se o usuário não estiver autenticado e a rota não for 'login' ou 'register',
    // redirecione para 'login'.
    if (!authenticated && !targetRoute.startsWith('/login') && !targetRoute.startsWith('/register')) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }

}