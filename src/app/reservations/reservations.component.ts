import { Component, OnInit } from '@angular/core';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { Reservation } from '../shared/model/reservation.model';
import { ReservationService } from '../shared/service/reservation.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    DeleteModalComponent,
    CommonModule,
    LucideAngularModule,
    RouterModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];

  constructor(private reservationService: ReservationService) {}

  isDeleteModalVisible: boolean = false;

  openDeleteModal() {
    this.isDeleteModalVisible = !this.isDeleteModalVisible;
  }

  ngOnInit() {
    this.getUpcomingReservations();
  }

  async getUpcomingReservations(): Promise<void> {
    let allReservations = await this.reservationService.getAllReservations();
    let now = new Date();

    let upcomingReservations = allReservations.filter((reservation) => {
      let startDateTime = new Date(reservation.startDateTime);
      return startDateTime >= now;
    });

    let sortedReservations = upcomingReservations.sort((a, b) => {
      return (
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
      );
    });

    this.reservations = sortedReservations;
  }
}
