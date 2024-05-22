import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReservationModelModel} from "../shared/models/reservation-model.model";
import {ActivatedRoute, Params} from "@angular/router";
import {ReservationService} from "../shared/service/reservation.service";

@Component({
    selector: 'app-reservation-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reservation-details.component.html',
    styleUrl: './reservation-details.component.scss'
})
export class ReservationDetailsComponent implements OnInit {
    reservation!: ReservationModelModel;
    id!: string;
    formattedDateTime!: string;

    constructor(private route: ActivatedRoute,
                private reservationService: ReservationService) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(
                (params: Params) => {
                    const paramsId = params['id'];
                    this.id = paramsId.toString();
                    //TODO reservation service get current reservation using id
                }
            )
        this.reservation = this.reservationService.getReservation();
        if (this.reservation) {
             this.formatDateTime();
        }
    }

    private formatDateTime() {
        if (!this.reservation || !this.reservation.startDateTime ) {
            return;
        }
        if (this.reservation && this.reservation.startDateTime) {
            const date = this.reservation.startDateTime;
            this.formattedDateTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }
    }
    }
