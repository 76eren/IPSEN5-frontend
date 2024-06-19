import { Injectable } from "@angular/core";
import { ReservationService } from "./reservation.service";
import { Reservation } from "../model/reservation.model";
import { User } from "../model/user.model";
import { Observable, catchError } from "rxjs";
import { ApiResponse, ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class UserService {
  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  getUserInfo(): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>('/user/me').pipe(
      catchError((error) => {
          this.toastr.error('Er is iets misgegaan bij het ophalen van de gebruikersinformatie');
          throw error;
      })
  );
  }
}