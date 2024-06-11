import {Injectable} from "@angular/core";
import {Reservation} from "../model/reservation.model";
import {ApiResponse, ApiService} from "./api.service";
import {ToastrService} from "ngx-toastr";
import { z } from 'zod';
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Role} from "../model/role";
import {User} from "../model/user.model";
import { Location, LocationType } from '../model/location.model';
import { Wing } from '../model/wing.model';
import { Floor } from '../model/floor.model';
import { Building } from '../model/building.model';

const reservationSchema = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    role: z.string(),
    phoneNumber: z.string(),
  }),
  location: z.object({
    wing: z.object({
      id: z.string(),
      floor: z.object({
        id: z.string(),
        building: z.object({
          id: z.string(),
          name: z.string(),
          address: z.string()
        }),
        number: z.string(),
      }),
      name: z.string(),
    }),
    name: z.string(),
    type: z.enum(['WORKPLACE', 'ROOM']),
    createdAt: z.string(),
    capacity: z.number(),
    multireservable: z.boolean()
  }),
  status: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  numberOfPeople: z.number(),
  createdAt: z.string()
});

const responseSchema = z.object({
  payload: z.array(reservationSchema),
  message: z.string().nullable()
});


@Injectable()
export class ReservationService {
  constructor(private apiService: ApiService, private toastr: ToastrService) {
  }


  getReservationsByUserId(userId: string): Observable<Reservation[]> {
    return this.apiService.get<ApiResponse<any>>(`/reservations/user/${userId}`).pipe(
      map(response => {
        try {
          const parsed = responseSchema.parse(response);
          return parsed.payload.map(res => {
            const user = new User(
              res.user.email,
              res.user.lastname,
              res.user.firstname,
              res.user.phoneNumber,
              Role[res.user.role as keyof typeof Role],
              res.user.id
            );
            const building = new Building(
              res.location.wing.floor.building.id,
              res.location.wing.floor.building.name,
              res.location.wing.floor.building.address
            );
            const floor = new Floor(
              res.location.wing.floor.id,
              building,
              res.location.wing.floor.number
            );
            const wing = new Wing(
              res.location.wing.id,
              floor,
              res.location.wing.name
            );
            const location = new Location(
              res.location.wing.id, // Assuming the id is on the wing object
              wing,
              res.location.name,
              LocationType[res.location.type],
              res.location.capacity,
              res.location.multireservable,
              new Date(res.location.createdAt)
            );

            return new Reservation(
              res.id,
              user,
              location,
              res.status,
              new Date(res.startDateTime),
              new Date(res.endDateTime),
              res.numberOfPeople,
              new Date(res.createdAt)
            );
          });
        } catch (error) {
          this.toastr.error('Invalid response structure');
          return [];
        }
      }),
      catchError(error => {
        this.toastr.error(error.message || 'An error occurred');
        return of([]);
      })
    );
  }


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

  getAllReservations2(){
    return this.apiService.get<ApiResponse<Reservation[]>>("/reservations/all");
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

  formatDate(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  makeReservation(reservation:{
    wingId: string,
    startDateTime: Date,
    endDateTime: Date, }){
    return this.apiService.post<ApiResponse<Reservation>>('/reservations/reserve-workplace', {
      body: {
        ...reservation,
        startDateTime: this.formatDate(reservation.startDateTime),
        endDateTime: this.formatDate(reservation.endDateTime)
      }
    });
  }
}
