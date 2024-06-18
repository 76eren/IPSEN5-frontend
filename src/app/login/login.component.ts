import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../shared/service/requests/login.service";
import {RouterLink} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public username?: string;
  public password?: string;
  public loginForm: FormGroup;
  public passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()\\-_=+\\\\|\\[{\\]};:\'",<.>/?]).{8,}$')
      ]]
    });
  }

  public togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.toastr.error('Vul een geldig emailadres en wachtwoord in', 'Ongeldige login')
      return;
    }

    this.loginService.login(this.username!, this.password!);
  }
}
