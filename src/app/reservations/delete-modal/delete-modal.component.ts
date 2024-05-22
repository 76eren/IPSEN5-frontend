import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {ReservationService} from "../../shared/service/reservation.service";

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() message: string = "Weet u het zeker dat u de reservering wilt annuleren?";
  @Input() deleteFunction!: () => void;
  @Input() selectedReservationId!: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reservationService: ReservationService){
  }

  public closeModal() {
    this.closeModalEvent.emit();
  }

  deletionPressed() {
    this.cancelReservation(this.selectedReservationId);
  }

  cancelReservation(reservationId: string) {
    this.reservationService.cancelReservation(reservationId).subscribe(
      data => {
        window.location.reload();
        //Hier wil ik later een modal tonen met een succes bericht
      }
    );
  }
}
