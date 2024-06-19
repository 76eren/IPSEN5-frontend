import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {ReservationService} from "../../service/reservation.service";
import {ToastrService} from "ngx-toastr";

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
  @Input() reservationId!: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reservationService: ReservationService,
              private toastr: ToastrService) {
  }

  public closeModal() {
    this.closeModalEvent.emit();
  }

  deletionPressed() {
    this.reservationService.deleteReservation(this.reservationId).subscribe(
      data => {
        this.reservationService.notifyReservationDeleted();
        this.closeModal();
        this.router.navigate(['/reservations']);
        this.toastr.success('Reservering succesvol verwijderd');
      } , error => {
        this.toastr.error('Fout bij het verwijderen van de reservering');
      }
    );
  }
}
