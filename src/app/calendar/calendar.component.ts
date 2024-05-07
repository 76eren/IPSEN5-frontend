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
import {CalendarEvent, FRIEND_EVENTS, INITIAL_EVENTS} from "./event-utils";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit{
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
  events:CalendarEvent[] = [
    new CalendarEvent(INITIAL_EVENTS),
    new CalendarEvent(FRIEND_EVENTS, 'yellow', 'black')
  ] ;
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
    eventSources: this.events,
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  constructor(private changeDetector: ChangeDetectorRef) {
    this.updateViewBasedOnWidth();
  }

  ngOnInit() {
    this.updateViewBasedOnWidth();
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
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
