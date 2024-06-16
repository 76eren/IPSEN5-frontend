import {AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild} from '@angular/core';
import {MatStepper, MatStepperModule, StepperOrientation} from "@angular/material/stepper";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {AsyncPipe, NgClass} from "@angular/common";
import {Building} from "../../shared/model/building.model";
import {BuildingStepComponent} from "./building-step/building-step.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {Wing} from "../../shared/model/wing.model";
import {MatIcon} from "@angular/material/icon";
import {ReservationType} from "../../shared/model/reservering-type.enum";
import {ReservationTypeStepComponent} from "./reservation-type-step/reservation-type-step.component";
import {FloorAndWingStepComponent} from "./floor-and-wing-step/floor-and-wing-step.component";
import {DateAndTimeStepComponent} from "./date-and-time-step/date-and-time-step.component";
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {map} from "rxjs/operators";
import {VerifyReservationStepComponent} from "./verify-reservation-step/verify-reservation-step.component";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {Floor} from "../../shared/model/floor.model";
import {MeetingroomPropertiesComponent} from "./meetingroom-properties/meetingroom-properties.component";
import {MeetingRoomStepComponent} from "./meeting-room-step/meeting-room-step.component";
import {Location} from "../../shared/model/location.model";


@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardImage,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    NgClass,
    BuildingStepComponent,
    MatSelect,
    MatOption,
    MatIcon,
    ReservationTypeStepComponent,
    FloorAndWingStepComponent,
    DateAndTimeStepComponent,
    AsyncPipe,
    VerifyReservationStepComponent,
    MeetingroomPropertiesComponent,
    MeetingRoomStepComponent,
  ],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class CreateReservationComponent implements AfterViewInit{
  @ViewChild('stepper') stepper!: MatStepper;
  protected selectedBuilding = new BehaviorSubject<Building | null>(null);
  protected selectedWing = new BehaviorSubject<Wing | null>(null);
  protected selectedFloor = new BehaviorSubject<Floor | null>(null);
  protected reservationDateAndTime = new BehaviorSubject<{ startDate: Date, endDate: Date } | null>(null);
  protected reservationType = new BehaviorSubject<ReservationType | null>(null);
  protected stepperOrientation!: Observable<StepperOrientation>;
  protected numberOfPersons = new BehaviorSubject<number | null>(null);
  protected selectedLocation = new BehaviorSubject<Location | null>(null);
  protected allWorkplaceFieldsAssigned = combineLatest([
    this.selectedBuilding,
    this.selectedWing,
    this.selectedFloor,
    this.reservationDateAndTime,
    this.reservationType
  ]).pipe(
    map(([building, wing, floor, dateAndTime, type]) =>
      building !== null && wing !== null && floor !== null && dateAndTime !== null && type !== null

    )

  );
  protected allMeetingRoomFieldsAssigned = combineLatest([
    this.selectedBuilding,
    this.reservationDateAndTime,
    this.numberOfPersons,
    this.selectedLocation,
    this.reservationType
  ]).pipe(
    map(([building, dateAndTime, numberOfPersons, location, type]) =>
      building !== null && dateAndTime !== null && numberOfPersons !== null && location !== null && type !== null

    )

  );

  constructor(private _formBuilder: FormBuilder,
              breakpointObserver: BreakpointObserver,
              private crf: ChangeDetectorRef,){
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngAfterViewInit(): void {
    this.allWorkplaceFieldsAssigned.subscribe(isAllAssigned => {
      if (isAllAssigned) {
        this.navigateToLastStep();
      }
    });
    this.allMeetingRoomFieldsAssigned.subscribe(isAllAssigned => {
      if (isAllAssigned) {
        this.navigateToLastStep();
      }
    });
  }

  navigateToLastStep() {
    setTimeout(() => {
      this.stepper.selectedIndex = this.stepper.steps.length - 1;
    }, 0);
  }

  addSelectedBuilding(value: Building) {
    this.selectedBuilding.next(value);
  }

  addSelectedWing(value: Wing) {
    this.selectedWing.next(value);
  }

  addReservationDateAndTime(value: { startDate: Date, endDate: Date }) {
    this.reservationDateAndTime.next(value);
  }

  addReservationType(value: ReservationType) {
    this.reservationType.next(value);
  }

  addSelectedFloor(value: Floor) {
    this.selectedFloor.next(value);
  }

  addNumberOfPersons(value: number) {
    this.numberOfPersons.next(value);
  }

  addSelectedLocation(value: Location) {
    this.selectedLocation.next(value);
  }

  protected readonly ReservationType = ReservationType;
}
