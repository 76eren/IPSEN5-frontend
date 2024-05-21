import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ApiService} from "../../shared/service/api.service";
import {ToastrService} from "ngx-toastr";
import {HttpHeaders} from "@angular/common/http";
import {ResetService} from "../../shared/service/requests/reset.service";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public token?: string;

  public username?: string;
  public password?: string;
  public passwordRepeat?: string;

  public isPasswordInvalid = false;
  public isPasswordRepeatInvalid = false;
  public isUsernameInvalid = false;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private resetService: ResetService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    console.log(token);
    if (token) {
      this.token = token;
      const body: object = {token: this.token.toLowerCase()};
      //TODO validate token doesnt exist yet
      this.apiService.post('/validate-token', body).subscribe(
        response => {
          this.toastr.success('Token is valid');
        },
        error => {
          this.toastr.error('Invalid token');
          //todo route back to request page
        }
      );
    } else {
      this.toastr.error('No token found in URL');
      //todo route back to request page
    }
  }

  onSubmit() {
    const isFormValid = this.validateFormValues();
    if(!isFormValid){
      return;
    }
    if (this.password && this.checkIfMatching()) {
      this.changePassword(this.password);
    }
  }

  private changePassword(password: string) {
    const email = this.username?.toLowerCase();
    if (!email || !this.token) {
      this.toastr.error('Onvolledige gegevens.');
      return;
    }

    const success = this.resetService.resetPassword(email, password, this.token);
    if (!success) {
      this.toastr.info('Er is een fout opgetreden bij het wijzigen van het wachtwoord.');
      return;
    }
    this.toastr.success('Wachtwoord succesvol gewijzigd.');
  }

  private validateFormValues(): boolean {
    this.isPasswordInvalid = !this.password;
    this.isPasswordRepeatInvalid = !this.passwordRepeat;
    this.isUsernameInvalid = !this.username || !/^\S+@\S+\.\S+$/.test(this.username.trim());

    if (!this.password || !this.passwordRepeat) {
      this.toastr.error('Vul een wachtwoord in.');
      return false;
    }
    if (!this.checkIfMatching()) {
      this.isPasswordRepeatInvalid = true;
      this.toastr.error('Wachtwoorden komen niet overeen.');
      return false;
    }
    if(!this.isUsernameInvalid){
      this.isUsernameInvalid = true;
      this.toastr.error('Ongeldige gebruikersnaam opgegeven.');
      return false;
    }
    return true;
  }

  private checkIfMatching(): boolean {
    return this.password === this.passwordRepeat;
  }


}
