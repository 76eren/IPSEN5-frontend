import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {LocationService} from "../../../shared/service/location.service";
import {Location} from "../../../shared/model/location.model";
import {LocationComponent} from "../../../manage-locations/location/location.component";
import {MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MeetingRoomUnitComponent} from "./meeting-room-unit/meeting-room-unit.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-meeting-room-step',
  standalone: true,
  imports: [
    LocationComponent,
    MatStepperNext,
    MatStepperPrevious,
    MeetingRoomUnitComponent,
    MatPaginatorModule,
  ],
  templateUrl: './meeting-room-step.component.html',
  styleUrl: './meeting-room-step.component.scss'
})
export class MeetingRoomStepComponent{
  roomsFormGroup: FormGroup;
  protected meetingRooms: Location[] = [];
  protected selectedLocation!: Location;
  protected canContinue = false;
  @Input() buildingId!: string;
  @Input() numberOfPersons!: number;
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Output() selectedMeetingRoom = new EventEmitter<Location>();
  length!: number;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedMeetingRooms!: Location[];

  constructor(private locationService: LocationService,
              private toastr: ToastrService){
    this.roomsFormGroup = new FormGroup({
      selectedMeetingRoom: new FormControl(null, Validators.required)
    });
  }

  handlePage(e: PageEvent) {
    this.pageSize = e.pageSize;
    const startIndex = e.pageIndex * e.pageSize;

    this.displayedMeetingRooms = this.meetingRooms.slice(startIndex, startIndex + this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['endDate'] && changes['endDate'].currentValue) {
      this.locationService.getAvailableMeetingRooms({
        buildingId: this.buildingId,
        numberOfPeople: this.numberOfPersons,
        startDateTime: this.formatDateTime(this.startDate),
        endDateTime: this.formatDateTime(this.endDate)
      }).subscribe(
        data => {
          this.meetingRooms = data.payload;
          this.length = this.meetingRooms.length;
          this.displayedMeetingRooms = this.meetingRooms.slice(0, this.pageSize);
        }
      );
    }
  }
  protected formatDate(date: Date): string {
    return date.toISOString().slice(0,10);
  }

  protected formatTime(date: Date): string {
    return date.toISOString().slice(11,19);
  }
  protected formatDateTime(date: Date): string {
    return this.formatDate(date) + 'T' + this.formatTime(date);
  }

  protected addMeetingRoom(location: Location){
    this.selectedMeetingRoom.emit(location);
    this.roomsFormGroup.get('selectedMeetingRoom')?.setValue(location);
  }

  protected toggleSelected(location: Location) {
    for (let meetingRoom of this.meetingRooms) {
      meetingRoom.isActivated = false;
    }
    location.isActivated = !location.isActivated;
    this.selectedLocation = location;
  }

  protected checkMeetingRoom() {
    if (!this.selectedLocation) {
      this.toastr.error('Selecteer een vergaderruimte!', 'Validatie Error');
      return;
    }
    this.addMeetingRoom(this.selectedLocation);
  }
}
