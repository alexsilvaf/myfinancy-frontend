import { Injectable } from '@angular/core';
import { Credenciais } from "../models/credenciais";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(
    private router: Router) { }

  authenticate(creds: Credenciais) {
    // Substitua os valores abaixo pelos valores reais que você está esperando.
    const validEmail = 'admin@mail.com';
    const validPassword = 'Password@123!';

    // Verifica se as credenciais fornecidas correspondem às credenciais válidas.
    if (creds?.email === validEmail && creds?.password === validPassword) {
      let resposta = {
        headers: {
          get: (headerName: string) => {
            if (headerName === 'Authorization') {
              return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMTQ3NDgzNjQ3fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            }
            return null;
          }
        }
      };

      // Cria um Observable que emite a resposta simulada.
      return of(resposta);
    } else {
      // Emite um erro se as credenciais são inválidas.
      return throwError(() => new Error('Email ou senha inválidos.'));
    }


    //TODO: Após o backend estar pronto, descomentar o código abaixo
    // return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
    //   observe: 'response',
    //   responseType: 'text'
    // })
  }

  successfulLogin(authToken: string) {
    localStorage.setItem('token', authToken);
    this.router.navigate(['home']);
  }

  isAuthenticated() {
    let token = localStorage.getItem('token')
    if (token != null) {
      return !this.jwtService.isTokenExpired(token);
    }
    return false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}