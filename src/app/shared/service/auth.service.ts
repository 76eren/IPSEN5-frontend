import {Injectable} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api.service";

@Injectable()
export class AuthService {
  constructor(private toastr: ToastrService, private router: Router, private http: HttpClient) {}


  parseToken = (token: string) => {

  };

  public isAuthenticated() {
    // TODO: This is a temporary implementation. Implement the actual logic after the API is ready to handle this
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  public isAdmin(): boolean {
    // Implement after the API is ready to handle this
    return true;
  }



  public getToken() {

  }

  public validateToken() {
    // Implement this after the API is ready to handle this
  }

  public isLoggedIn() {

  }

  public signout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public getId() {


  }
}
