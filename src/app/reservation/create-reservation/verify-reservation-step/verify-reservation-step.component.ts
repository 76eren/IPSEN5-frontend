import {Component, Input} from '@angular/core';
import {ReservationService} from "../../../shared/service/reservation.service";
import {Wing} from "../../../shared/model/wing.model";
import {Floor} from "../../../shared/model/floor.model";
import {Building} from "../../../shared/model/building.model";
import {ReservationType} from "../../../shared/model/reservering-type.enum";
import {DatePipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {Location} from "../../../shared/model/location.model";
import {ToastrService} from "ngx-toastr";

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
  @Input() floor?: Floor;
  @Input() wing?: Wing;
  @Input() startDate = new Date();
  @Input() endDate = new Date();
  @Input() reservationType!: ReservationType;
  @Input() location!: Location;
  @Input() numberOfPersons!: number;

  isLoading = false;

  constructor(private reservationService: ReservationService,
              private router: Router,
              private toastr: ToastrService) {
  }

  protected formatDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  protected formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  protected makeReservation(): void {
    this.isLoading = true;
    if (this.reservationType == ReservationType.FLEXPLEK){
      this.makeWorkplaceReservation();
    }
    this.makeMeetingRoomReservation();
  }

  protected makeWorkplaceReservation(): void {
    this.reservationService.makeWorkplaceReservation({
      wingId: this.wing!.id,
      startDateTime: this.startDate,
      endDateTime: this.endDate
    }).subscribe(
      data => {
        this.isLoading = false;
        this.router.navigate(['/create-reservation/success']);
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Er is iets misgegaan bij het maken van de reservering', 'Fout');
      }
    );
  }

  protected makeMeetingRoomReservation(): void {
    this.reservationService.makeMeetingRoomReservation({
      locationId: this.location.id,
      startDateTime: this.startDate,
      endDateTime: this.endDate,
      numberOfAttendees: this.numberOfPersons
    }).subscribe(
      data => {
        this.isLoading = false;
        this.router.navigate(['/create-reservation/success']);
      },
      error => {
        this.isLoading = false;
        this.toastr.error('Er is iets misgegaan bij het maken van de reservering', 'Fout');
      }
    );
  }

  protected readonly ReservationType = ReservationType;
}
