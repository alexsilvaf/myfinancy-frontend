import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Credenciais } from 'app/models/credenciais';
import { UserModel } from 'app/models/user.model';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  loginAttempts = 0;
  showCaptcha = false;

  creds: Credenciais = {
    email: 'admin@mail.com',
    password: 'Password@123!',
  }

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      remember: [false]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.creds.email = this.loginForm.get('email')?.value;
      this.creds.password = this.loginForm.get('password')?.value;
      let remember = this.loginForm.get('remember')?.value;

      this.authService.authenticate(this.creds).subscribe(resposta => {
        this.loginAttempts = 0;
        this.authService.successfulLogin(resposta.headers?.get('Authorization').substring(7), remember);
        this.snackBar.open('Login realizado com sucesso', 'Fechar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      }, () => {
        this.loginError = 'Email ou senha inválidos.';
        this.snackBar.open(this.loginError, 'Fechar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          panelClass: ['custom-snackbar']
        });
        this.sumLoginError();
      });
    } else {
      this.snackBar.open('Preencha os campos corretamente', 'Fechar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['custom-snackbar']
      });
      this.sumLoginError();
    }
  }

  sumLoginError() {
    this.loginAttempts++;
    this.showCaptcha = this.loginAttempts >= 3;
  }

  resolvedCaptcha(response: string) {
    console.log(response);
  }
}
