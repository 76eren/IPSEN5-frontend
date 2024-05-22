import {Component, OnInit} from '@angular/core';
import {DeleteModalComponent} from "./delete-modal/delete-modal.component";
import {ReservationService} from "../shared/service/reservation.service";
import {Reservation} from "../shared/models/Reservation.model";

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    DeleteModalComponent
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit{
  isDeleteModalVisible: boolean = false;
  reservations!: Reservation[];
  selectedReservationId!: string;

  constructor(private reservationService: ReservationService) {
  }

  ngOnInit(): void {
  this.reservationService.getReservations().subscribe(
    data => {
      this.reservations = data.payload.map(reservation => new Reservation(
        reservation.id,
        reservation.user,
        reservation.location,
        reservation.status,
        new Date(reservation.startDateTime),
        new Date(reservation.endDateTime),
        reservation.numberOfPeople,
        new Date(reservation.createdAt)
      ));
    }
  );
  }

  openDeleteModal() {
    this.isDeleteModalVisible = !this.isDeleteModalVisible;
  }

  getDate(date: Date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  getTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}`;
  }
}
