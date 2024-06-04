import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Reservation } from '../model/reservation.model';
import { User } from '../model/user.model';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ReservationService {
  
    constructor(private apiService: ApiService, private toastr: ToastrService) {}

  getAllReservations(): Promise<Reservation[]> {
    return this.apiService.get<any>('/reservations/all')
      .toPromise()
      .then((response) => {
        return response.payload;
      })
      .catch((error) => {
        error.error ? this.toastr.error(error.error.message) : this.toastr.error('Fout bij het ophalen van reserveringen');
        return [];
      });
  }

  getReservationById(id: string): Promise<Reservation> {
    return this.apiService.get<any>(`/reservations/${id}`)
      .toPromise()
      .then((response) => {
        return response.payload;
      })
      .catch((error) => {
        error.error ? this.toastr.error(error.error.message) : this.toastr.error('Fout bij het ophalen van reservering');
        return [];
      });
  }

  deleteReservation(id: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(`/reservations/${id}/cancel`)
    .pipe(
      catchError((error) => {
        this.toastr.error('Fout bij het annuleren van reservering');
        return [];
      }
    ));
  }
}
