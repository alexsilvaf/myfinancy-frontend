import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent {
  userAccountForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userAccountForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword') // Adicionar validação personalizada para senhas correspondentes
    });
  }

  onSubmit(): void {
    if (this.userAccountForm.valid) {
      console.log('Form Data: ', this.userAccountForm.value);
      // Aqui você pode adicionar lógica para enviar os dados para o backend
    }
  }

  onCancel(): void {
    // Lógica para cancelar as alterações
    this.userAccountForm.reset();
  }

  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      // Correção aqui: Uso da notação de colchetes para acessar 'mustMatch'
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return; // Retorna se outro validador já encontrou um erro no MatchingControl
      }

      // Define erro em matchingControl se a validação falhar
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ 'mustMatch': true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
