import { Routes } from '@angular/router';
import {ReservationDetailsComponent} from "./reservation-details/reservation-details.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {ReservationsComponent} from "./reservations/reservations.component";
import { HomeComponent } from "./home/home.component";
import { AppLayoutComponent } from "./app-layout/app-layout.component";
import { LoginComponent } from "./login/login.component";
import { loginGuard } from "./shared/guard/login.guard";
import { AuthGuard } from "./shared/guard/auth.guard";
import {RequestResetPasswordComponent} from "./login/reset-password/request-reset/request-reset-password.component";
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { ManageLocationsComponent } from './manage-locations/manage-locations.component';
import {UsersComponent} from "./users/users.component";
import {AdminGuard} from "./shared/guard/admin.guard";
import {ReserveSuccessComponent} from "./shared/utilities/reserve-success/reserve-success.component";
import {FavoritesComponent} from "./favorites/favorites.component";
import {CreateReservationComponent} from "./reservation/create-reservation/create-reservation.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'reset-password',
    component: RequestResetPasswordComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    //TODO check which guard, maybe custom
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'calendar',
        title: 'Calendar',
        component: CalendarComponent,
      },
      {
        path: 'reservation/details/:id',
        component: ReservationDetailsComponent,
      },
      {
        path: 'reservations',
        title: 'Reservations',
        component: ReservationsComponent,
      },
      {
        path: 'create-reservation',
        component: CreateReservationComponent,
      },
      {
        path: 'create-reservation/success',
        component: ReserveSuccessComponent
      },
      {
        path: 'reports',
        component: ReportDashboardComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'manage/locations',
        component: ManageLocationsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'favorites',
        component: FavoritesComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
