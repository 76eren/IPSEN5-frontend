import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DeleteModalComponent} from "../shared/utilities/delete-modal/delete-modal.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {Reservation} from "../shared/model/reservation.model";
import {ReservationService} from "../shared/service/reservation.service";
import {ToastrService} from "ngx-toastr";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { locationTypeTranslations } from '../shared/model/location.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    DeleteModalComponent,
    MatExpansionModule,
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit{
  protected isDeleteModalVisible: boolean = false;
  protected reservations: Reservation[] = [];
  public locationTypeTranslation = locationTypeTranslations;
  protected reservationId!: string;

  constructor(private reservationService: ReservationService,
              private toastr: ToastrService,
              private changeDetectorRef: ChangeDetectorRef,){
  }

  ngOnInit(): void {
    this.refreshLessonsList();
    this.reservationService.reservationDeleted$.subscribe(() => {
      this.refreshLessonsList();
    });
  }

  sortByDate(items: Reservation[]): Reservation[] {
    return items.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  }

  protected getDate(dateToFormat: Date) {
    const date = new Date(dateToFormat);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  protected getTime(dateToFormat: Date) {
    const date = new Date(dateToFormat);
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  protected openDeleteModal(id: string) {
    this.reservationId = id;
    this.isDeleteModalVisible = !this.isDeleteModalVisible;
  }

  refreshLessonsList(): void {
    this.changeDetectorRef.detectChanges();
    this.reservationService.getAllReservations2().subscribe(
      data => {
        this.reservations = data.payload;
        this.reservations = this.sortByDate(this.reservations);
      }, error => {
        if (error && (error as any).error) {
          this.toastr.error((error as any).error.message);
        } else {
          this.toastr.error('Fout bij het ophalen van reserveringen');
        }
      }
    );
  }
}
