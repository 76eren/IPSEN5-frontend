import {Injectable} from "@angular/core";
import {ReservationModelModel} from "../models/reservation-model.model";
import {locationsModel} from "../models/locations.model";
import {Observable} from "rxjs";
import {ApiResponse, ApiService} from "./api.service";
import {Reservation} from "../models/Reservation.model";

@Injectable()
export class ReservationService {
    currentReservation: ReservationModelModel;

    constructor(private apiService: ApiService) {
        const currentLocation =  {
            location: 'Amsterdam',
            address: 'De Entree 21',
            city: 'Amsterdam',
            zip: '1101 BH',
        }
        this.currentReservation = new ReservationModelModel('testID', currentLocation, 'Z', 2, 'AMS2a',
            'Flexplek', new Date(2024, 4, 7, 11, 30));
    }

    getReservation(){
        //TODO get from API using id (add to param) instead of hardcoded
        return this.currentReservation;
    }

    getReservations():Observable<ApiResponse<Reservation[]>>{
      return this.apiService.get<ApiResponse<Reservation[]>>('/reservation/all');
    }

    cancelReservation(reservationId: string) {
      return this.apiService.post('/reservation/'+reservationId+'/cancel');
    }
}
