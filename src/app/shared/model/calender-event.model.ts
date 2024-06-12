import {EventInput} from "@fullcalendar/core";

export class CalendarEvent {
  events: EventInput[];
  color?: string;
  textColor?: string;

  constructor(events: EventInput[], color?: string, textColor?: string) {
    this.events = events;
    this.color = color;
    this.textColor = textColor;
  }
}
