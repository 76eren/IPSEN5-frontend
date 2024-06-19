import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Reservation} from '../shared/model/reservation.model';
import {ActivatedRoute, Params, RouterModule} from '@angular/router';
import {ReservationService} from '../shared/service/reservation.service';
import {locationTypeTranslations} from '../shared/model/location.model';
import {DeleteModalComponent} from "../shared/utilities/delete-modal/delete-modal.component";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

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
  protected deletable!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const paramsId = params['id'];
      this.id = paramsId.toString();
      this.getReservation().then(() => this.isReservationDeletable());
    });
  }

  async getReservation(): Promise<void> {
    this.reservation = await this.reservationService.getReservationById(this.id);
  }

  protected openDeleteModal() {
    this.isDeleteModalVisible = !this.isDeleteModalVisible;
  }

  protected isReservationDeletable() {
    this.deletable = this.reservationService.getAllReservations2().pipe(
      map(data => {
        return data.payload.some(reservation => {
          return reservation.id === this.id;
        });
      })
    );
  }
}
