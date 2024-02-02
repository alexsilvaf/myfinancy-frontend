import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit, OnDestroy {
  private scriptTag: HTMLScriptElement;
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

  ngOnInit(): void {
    this.scriptTag = document.createElement('script');
    this.scriptTag.src = 'https://www.google.com/recaptcha/enterprise.js?render=6Lc_cmIpAAAAAB4BdbXrsgLfBpFi12D78JtFUjFU';
    this.scriptTag.async = true;
    this.scriptTag.defer = true;
    document.body.appendChild(this.scriptTag);
  }

  ngOnDestroy(): void {
    this.removeRecaptchaScript();
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

  removeRecaptchaScript(): void {
    // Remove reCAPTCHA icon 
    const badge = document.querySelector('.grecaptcha-badge');
    if (badge) {
      badge.parentNode.removeChild(badge);
    }

    // Remove reCAPTCHA script
    const recaptchaScript = document.querySelector('script[src*="recaptcha"]');
    if (recaptchaScript) {
      recaptchaScript.parentNode.removeChild(recaptchaScript);
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
