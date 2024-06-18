import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Params, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ResetPasswordService} from '../../shared/service/requests/reset-password.service';
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetForm: FormGroup;
  private _token: string = '';

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private resetService: ResetPasswordService,
              private toastr: ToastrService) {
    this.resetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[0-9])(?=.*[A-Z]).{8,}')
      ]],
      passwordRepeat: ['', Validators.required]
    }, {validators: this.passwordsMatchValidator});
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this._token = params['token'];
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.toastr.error('De ingevulde gegevens zijn onvolledig. Controleer de velden.');
      return;
    }

    const {username, password} = this.resetForm.value;
    if (this._token) {
      this.changePassword(username, password);
    }
  }

  public isControlInvalid(controlName: string): boolean {
    const control = this.resetForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  private changePassword(username: string, password: string): void {
    if (!username || !this._token) {
      this.toastr.error('Onvolledige gegevens.');
      return;
    }

    this.resetService.resetPassword(username.toLowerCase(), password, this._token);
  }

  private passwordsMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password');
    const passwordRepeat = form.get('passwordRepeat');
    return password && passwordRepeat && password.value !== passwordRepeat.value ? {mismatch: true} : null;
  };

}
