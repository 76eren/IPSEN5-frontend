import {Component, Input} from '@angular/core';
import {ReservationService} from "../../../shared/service/reservation.service";
import {Reservation} from "../../../shared/model/reservation.model";
import {string} from "zod";
import {Wing} from "../../../shared/model/wing.model";
import {Floor} from "../../../shared/model/floor.model";
import {Building} from "../../../shared/model/building.model";
import {ReservationType} from "../../../shared/model/reservering-type.enum";
import {DatePipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-verify-reservation-step',
  standalone: true,
  imports: [
    DatePipe,
    NgIf
  ],
  templateUrl: './verify-reservation-step.component.html',
  styleUrl: './verify-reservation-step.component.scss'
})
export class VerifyReservationStepComponent {
  @Input() building!: Building;
  @Input() floor!: Floor;
  @Input() wing!: Wing;
  @Input() startDate = new Date();
  @Input() endDate = new Date();
  @Input() reservationType!: ReservationType;

  isLoading = false;

  constructor(private reservationService: ReservationService,
              private router: Router){
  }

  formatDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  makeReservation(): void {
    this.isLoading = true;
    this.reservationService.makeReservation({
      wingId: this.wing.id,
      startDateTime: this.startDate,
      endDateTime: this.endDate
    }).subscribe(
      data => {
        this.isLoading = false;
        this.router.navigate(['/create-reservation/success']);
      },
      error => {
        this.isLoading = false;
        // handle error here
      }
    );
  }
}
