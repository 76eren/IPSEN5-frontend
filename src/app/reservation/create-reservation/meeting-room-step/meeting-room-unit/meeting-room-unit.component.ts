import {Component, Input} from '@angular/core';
import {Location} from "../../../../shared/model/location.model";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-meeting-room-unit',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './meeting-room-unit.component.html',
  styleUrl: './meeting-room-unit.component.scss'
})
export class MeetingRoomUnitComponent {
  @Input() location!: Location;

}
