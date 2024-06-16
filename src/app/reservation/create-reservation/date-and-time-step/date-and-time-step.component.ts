import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {NgxMaterialTimepickerModule, TIME_LOCALE} from "ngx-material-timepicker";
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-date-and-time-step',
  standalone: true,
  imports: [
    MatStepperNext,
    MatStepperPrevious,
    MatFormFieldModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './date-and-time-step.component.html',
  styleUrl: './date-and-time-step.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class DateAndTimeStepComponent {
  dateAndTimeFormGroup: FormGroup;
  protected selectedDate!: Date;
  protected startTime = '';
  protected endTime = '';
  protected readonly Date = Date;
  protected currentTime!: string;
  @Output() reservationDateAndTime = new EventEmitter<{ startDate: Date, endDate: Date }>();
  @Input() stepper!: MatStepper;

  constructor(private toastr: ToastrService) {
    this.currentTime = this.getCurrentTime();
    this.dateAndTimeFormGroup = new FormGroup({
      selectedDate: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      endTime: new FormControl(null, Validators.required)
    });
  }
  private getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
  }

  protected getStartFormattedDateAndTime(dateToFormat: Date, timeToFormat: string): Date {
    const date = new Date(dateToFormat);
    const [hours, minutes] = timeToFormat.split(':').map(Number);
    date.setHours(hours, minutes);
    return date;
  }

  protected addReservationDateAndTime(): void {
    if (!this.selectedDate || !this.startTime || !this.endTime) {
      this.toastr.error('Alle velden zijn verplicht!', 'Validatie Error');
      return;
    }

    const startDate = this.getStartFormattedDateAndTime(this.selectedDate, this.startTime);
    const endDate = this.getStartFormattedDateAndTime(this.selectedDate, this.endTime);

    if (endDate <= startDate) {
      this.toastr.error('Eindtijd moet na starttijd zijn!', 'Validatie Error');
      return;
    }

    this.reservationDateAndTime.emit({startDate, endDate});
    this.dateAndTimeFormGroup.setValue({selectedDate: this.selectedDate, startTime: this.startTime, endTime: this.endTime});
    this.stepper.next();
  }
}
