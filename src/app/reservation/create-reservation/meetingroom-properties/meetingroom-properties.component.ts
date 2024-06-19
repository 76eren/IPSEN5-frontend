import {Component, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {ThemePalette} from "@angular/material/core";
import {MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

export interface ChipColor {
  name: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-meetingroom-properties',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatChipsModule,
    MatStepperNext,
    MatStepperPrevious,
    FormsModule
  ],
  templateUrl: './meetingroom-properties.component.html',
  styleUrl: './meetingroom-properties.component.scss'
})
export class MeetingroomPropertiesComponent {
  propertiesFormGroup: FormGroup;
  protected numberOfPersons!: number;
  @Output() numberOfPersonsChange = new EventEmitter<number>();

  constructor(private toastr: ToastrService) {
    this.propertiesFormGroup = new FormGroup({
      numberOfPersonsChange: new FormControl(null, Validators.required),
    });
  }

  protected addNumberOfPersons(value: number){
    this.numberOfPersonsChange.emit(value);
    this.propertiesFormGroup.setValue({numberOfPersonsChange: value});
  }

  protected checkNumberOfPersons() {
    if (!this.propertiesFormGroup.get('numberOfPersonsChange')?.valid) {
      this.toastr.error('Voer een aantal personen in!', 'Validatie Error');
      return;
    }
  }
}
