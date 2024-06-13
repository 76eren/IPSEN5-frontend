import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox/inbox.component';
import { NotificationService } from '../shared/service/notification.service';
import { LucideAngularModule } from 'lucide-angular';
import { UpcomingReservationsComponent } from './upcoming-reservations/upcoming-reservations.component';
import { DefaultLocationComponent } from './default-location/default-location.component';
import { RouterModule } from '@angular/router';
import { CreateReservationService } from '../shared/service/create-reservation.service';
import { Reservation } from '../shared/model/reservation.model';
import { Notification } from '../shared/model/notification.model';
import { User } from '../shared/model/user.model';
import { StandardLocation } from '../shared/model/standard-location.model';
import { UserService } from '../shared/service/user.service';
import { ReservationService } from '../shared/service/reservation.service';
import { Wing } from '../shared/model/wing.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    InboxComponent,
    LucideAngularModule,
    UpcomingReservationsComponent,
    DefaultLocationComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public notifications: Notification[] = [];
  public reservations: Reservation[] = [];
  public user!: User;

  public favoriteLocation!: Wing;

  constructor(private notificationService: NotificationService, private createReservationService: CreateReservationService, private userService: UserService, private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.getNotifications()
    this.getFavoriteLocation()
    this.getUpcomingReservations();
    this.getUserInfo()
  }


  private getNotifications(): void {
    this.notifications = this.notificationService.getAllNotifications()
  }

  private getFavoriteLocation(): void {
    this.createReservationService.getDefaultLocation().subscribe((response) => {
      this.favoriteLocation = response.payload;
    })
  }

  async getUpcomingReservations(): Promise<void> {
    let allReservations = await this.reservationService.getAllReservations();
    let now = new Date();

    let upcomingReservations = allReservations.filter((reservation) => {
      let startDateTime = new Date(reservation.startDateTime);
      return startDateTime >= now;
    });

    this.reservations = upcomingReservations.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()).slice(0, 3);
  }

  private getUserInfo(): void {
    this.userService.getUserInfo().subscribe((response) => {
      this.user = response.payload;
      console.log(this.user)
    })
  }

}
