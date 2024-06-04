import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../shared/model/reservation.model';
import { ToastrService } from 'ngx-toastr';
import { ReservationService } from '../../shared/service/reservation.service';
import { ReservationsComponent } from '../reservations.component';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() message: string =
    'Weet u het zeker dat u de reservering wilt annuleren?';
  @Input() deleteFunction!: () => void;
  @Input() reservation!: Reservation;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private reservationService: ReservationService,
    private reservationComponent: ReservationsComponent
  ) {}

  public closeModal() {
    this.closeModalEvent.emit();
  }

  deletionPressed() {
    this.toastr.success('Reservering is geannuleerd');
    
    this.reservationComponent.getUpcomingReservations();

    this.closeModal();
  }
}
