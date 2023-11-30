import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['user@example.com', [Validators.required, Validators.email]],
      password: ['Password@132!', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const mockUser = new UserModel();
      mockUser.id = 1;
      mockUser.name = 'User';
      mockUser.email = 'user@example.com';

      if (email === mockUser.email && password === 'Password@132!') {
        this.authService.login(mockUser);
        this.snackBar.open('Logado com sucesso', 'Fechar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
      } else {
        this.loginError = 'Email ou senha inválidos.';
        this.snackBar.open(this.loginError, 'Fechar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          panelClass: ['custom-snackbar']
        });
      }
    }
  }
}
