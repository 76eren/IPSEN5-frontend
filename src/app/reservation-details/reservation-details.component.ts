import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Reservation} from '../shared/model/reservation.model';
import {ActivatedRoute, Params, Router, RouterModule} from '@angular/router';
import {AuthService} from "../shared/service/auth.service";
import {from} from "rxjs";
import {ReservationService} from '../shared/service/reservation.service';
import {locationTypeTranslations} from '../shared/model/location.model';
import {Observable} from "rxjs";
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
  protected deletable!: Observable<boolean>;
  public isCheckingOwnReservations = true;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const paramsId = params['id'];
      this.id = paramsId.toString();
    });

    this.getReservation();
  }

  getReservation(): void {
    from(this.reservationService.getReservationById(this.id)).subscribe(
      (reservation) => {
        this.reservation = reservation;
        this.checkIfUserIsCheckingOwnReservation();
      },
      (error) => {
        console.error('Error fetching reservation', error);
      }
    );
  }

  goToReservations() {
    this.router.navigate(['/reservations/'+this.reservation.user.id]);
  }

  protected openDeleteModal() {
    this.isDeleteModalVisible = !this.isDeleteModalVisible;
  }

  checkIfUserIsCheckingOwnReservation() {
    this.authService.isIdOfLoggedInUser(this.reservation.user.id!).subscribe(
      (isOwnId) => {
        this.isCheckingOwnReservations = isOwnId;
      }
    )
  }

}
