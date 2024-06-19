import {
  Component,
  signal,
  ChangeDetectorRef,
  OnInit,
  HostListener,
} from '@angular/core';
import {CalendarOptions, EventClickArg, EventApi,} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendarModule} from "@fullcalendar/angular";
import timeGridPlugin from '@fullcalendar/timegrid';
import nlLocale from '@fullcalendar/core/locales/nl';
import {User} from "../shared/model/user.model";
import {FavoriteUserService} from "../shared/service/favorite-user.service";
import {ToastrService} from "ngx-toastr";
import {CommonModule, NgForOf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ReservationService} from "../shared/service/reservation.service";
import {Reservation} from "../shared/model/reservation.model";
import {ActivatedRoute, Router} from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    NgForOf,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  public favoriteColleagues: User[] = [];
  public personSelectForm!: FormGroup;
  private selectedUser?: User;
  protected events: any[] = [];

  @HostListener('window:resize', ['$event'])
  onResize() {
    const newView = window.innerWidth < 700 ? 'timeGridDay' : 'dayGridMonth';
    if (this.calendarOptions().initialView !== newView) {
      this.calendarOptions.set({
        ...this.calendarOptions(),
        initialView: newView
      });
      this.changeDetector.detectChanges();
    }
  }

  currentEvents = signal<EventApi[]>([]);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventColor: '#E21938',
    nowIndicator: true,
    locale: nlLocale,
    initialView: 'dayGridMonth',
    events: this.events,
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDataTransform: function(eventData) {
      return {
        ...eventData,
        extendedProps: {
          isColleagueEvent: eventData['isColleagueEvent']
        }
      };
    }
  });

  constructor(
    private changeDetector: ChangeDetectorRef,
    private favoriteUserService: FavoriteUserService,
    private toastr: ToastrService,
    private reservationService: ReservationService,
    private router: Router
  ) {

    this.updateViewBasedOnWidth();
  }

  ngOnInit() {
    this.personSelectForm = new FormGroup({
      'favourite-user': new FormControl(null, Validators.required)
    });

    this.getFavoriteUsers();
    this.getCurrentReservations();
    this.updateViewBasedOnWidth();
  }

  mapEvents(reservations: Reservation[]): void {
    this.events = reservations.map(reservation => ({
      id: reservation.id,
      title: reservation.location.type,
      start: reservation.startDateTime,
      end: reservation.endDateTime,
      backgroundColor: 'green',
      textColor: 'white',
      extendedProps: {
        isColleagueEvent: false
      }
    }));
  }

  mapColleagueEvents(reservations: Reservation[]): void {
    this.events = reservations.map(reservation => ({
      id: reservation.id,
      title: this.selectedUser!.firstName,
      start: reservation.startDateTime,
      end: reservation.endDateTime,
      backgroundColor: 'blue',
      textColor: 'white',
      extendedProps: {
        isColleagueEvent: true
      }
    }));
  }

  getCurrentReservations(): void {
    this.reservationService.getAllReservations().then(
      (response) => {
        this.mapEvents(response);

        this.calendarOptions.set({
          ...this.calendarOptions(),
          events: this.events
        });
      },
      (error) => {
        this.toastr.error("Probeer het later nog een keer", "Fout bij ophalen van reserveringen")
      }
    );
  }

  getFavoriteUsers(): void {
    this.favoriteUserService.getFavoriteColleagues().subscribe(
      (response) => {
        this.favoriteColleagues = response.payload;
      },
      (error) => {
        this.toastr.error("Probeer het later nog een keer", "Fout bij ophalen van favoriete collega's")
      }
    );
  }

  updateViewBasedOnWidth() {
    let initialView!: string;
    if (window.innerWidth < 768) {
      initialView = 'timeGridDay';
    } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      initialView = 'timeGridWeek';
    } else {
      initialView = 'dayGridMonth';
    }

    this.calendarOptions.set({
      ...this.calendarOptions(),
      initialView: initialView
    });
  }


  handleEventClick(clickInfo: EventClickArg) {
    const isColleagueEvent = clickInfo.event.extendedProps['isColleagueEvent'];

    if (!isColleagueEvent){
      const route = "/reservation/details/" + clickInfo.event.id.toString();
      this.router.navigate([route]);
    }
    //todo colleague reservation details
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  onChangePerson() {
    this.selectedUser = this.personSelectForm.get('favourite-user')?.value;
    let userId: string = this.selectedUser!.id!;

    this.reservationService.getReservationsByUserId(userId).subscribe(
      (reservations) => {
        this.mapColleagueEvents(reservations);

        this.calendarOptions.set({
          ...this.calendarOptions(),
          eventSources: this.events
        });
      },
      (error) => {
        this.toastr
          .error("Probeer het later nog een keer", "Fout bij ophalen van reserveringen van collega")
      }
    );
  }

  onSubmitForm() {

  }
}
