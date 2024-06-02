import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {NgxMaterialTimepickerModule, TIME_LOCALE} from "ngx-material-timepicker";
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-date-and-time-step',
  standalone: true,
  imports: [
    MatStepperNext,
    MatStepperPrevious,
    MatFormFieldModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    FormsModule
  ],
  templateUrl: './date-and-time-step.component.html',
  styleUrl: './date-and-time-step.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class DateAndTimeStepComponent {
  dateAndTimeFormGroup: FormGroup;
  protected startDate = new Date();
  protected startTime = '';
  protected endDate = new Date();
  protected endTime = '';
  protected readonly Date = Date;
  protected currentTime!: string;
  @Output() reservationDateAndTime = new EventEmitter<{ startDate: Date, endDate: Date }>();

  constructor() {
    const now = new Date();
    this.currentTime = `${now.getHours()}:${now.getMinutes()}`;
    this.dateAndTimeFormGroup = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      endTime: new FormControl(null, Validators.required)
    });
  }

  protected getStartFormattedDateAndTime(dateToFormat: Date, timeToFormat: string): Date {
    const date = new Date(dateToFormat);
    const [hours, minutes] = timeToFormat.split(':').map(Number);
    date.setHours(hours, minutes);
    return date;
  }

  protected addReservationDateAndTime(): void {
    const startDate = this.getStartFormattedDateAndTime(this.startDate, this.startTime);
    const endDate = this.getStartFormattedDateAndTime(this.endDate, this.endTime);
    this.reservationDateAndTime.emit({startDate, endDate});
    this.dateAndTimeFormGroup.setValue({startDate, startTime: this.startTime, endDate, endTime: this.endTime});
  }
}
