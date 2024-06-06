import {Component, EventEmitter, Output} from '@angular/core';
import {ReservationType} from "../../../shared/model/reservering-type.enum";
import {MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reservation-type-step',
  standalone: true,
  imports: [
    MatStepperNext,
    MatStepperPrevious
  ],
  templateUrl: './reservation-type-step.component.html',
  styleUrl: './reservation-type-step.component.scss'
})
export class ReservationTypeStepComponent {
  typeFormGroup: FormGroup;
  @Output() reservationType = new EventEmitter<ReservationType>();
  protected readonly ReservationType = ReservationType;
  protected selectedType!: ReservationType;

  constructor(private _formBuilder: FormBuilder,
              private toastr: ToastrService) {
    this.typeFormGroup = this._formBuilder.group({
      reservationType: new FormControl(null, Validators.required)
    });
  }

  protected setReservationType(type: ReservationType): void {
    this.selectedType = type;
    this.reservationType.emit(type);
    this.typeFormGroup.get('reservationType')!.setValue(type);
    }

  protected checkValidReservationType() {
    if (!this.selectedType) {
      this.toastr.error('Een type is verplicht!', 'Validatie Error');
      return;
    }
  }
}
