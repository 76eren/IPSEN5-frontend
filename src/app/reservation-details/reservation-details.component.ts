import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../shared/model/reservation.model';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ReservationService } from '../shared/service/reservation.service';
import { locationTypeTranslations } from '../shared/model/location.model';
import {DeleteModalComponent} from "../shared/utilities/delete-modal/delete-modal.component";

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [CommonModule, RouterModule, DeleteModalComponent],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss',
})
export class ReservationDetailsComponent implements OnInit {
  reservation!: Reservation;
  id!: string;
  public locationTypeTranslation = locationTypeTranslations;
  protected isDeleteModalVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const paramsId = params['id'];
      this.id = paramsId.toString();
    });

    this.getReservation();
  }

  async getReservation(): Promise<void> {
    this.reservation = await this.reservationService.getReservationById(this.id);
  }
  protected openDeleteModal() {
    this.isDeleteModalVisible = !this.isDeleteModalVisible;
  }
}
