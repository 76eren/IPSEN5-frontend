import {Injectable} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiResponse, ApiService} from "./api.service";
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { User } from "../model/user.model";

@Injectable()
export class AuthService {
  constructor(private toastr: ToastrService, private router: Router, private http: HttpClient, private apiService: ApiService) {}

  public isAuthenticated(): Observable<boolean> {
    let endpoint = '/auth/authenticated';

    return this.apiService.get<any>(endpoint)
      .pipe(
        map(response => {
          if (response.payload && response.payload.authenticated) { // TODO: validate response payload
            return true;
          }
          else {
            return false;
          }
        }),
        catchError(error => {
          return of(false);
        })
      );
  }

  public isAdmin(): boolean {
    // Implement after the API is ready to handle this
    return true;
  }


  public getToken(): string {
    return "";
  }

  public validateToken(): void {
    // Implement this after the API is ready to handle this
  }


  public signout(): void {
    this.apiService.post<any>('/auth/logout')
      .subscribe({
        next: () => {
          this.toastr.success('Logout successful!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastr.error('Logout failed.');
        }
      });
  }

  public getId(): string {
    return "";
  }

}
