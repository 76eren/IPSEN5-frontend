import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Location, LocationType, locationTypeTranslations } from '../../shared/model/location.model';
import { Building } from '../../shared/model/building.model';
import { ApiResponse } from '../../shared/service/api.service';
import { Wing } from '../../shared/model/wing.model';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../shared/service/location.service';
import { WingService } from '../../shared/service/wing.service';

@Component({
  selector: 'app-create-location',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './create-location.component.html',
  styleUrl: './create-location.component.scss'
})
export class CreateLocationComponent implements OnInit {
  @Input() buildings: Building[] = [];
  @Output() exitCreateMode: EventEmitter<void> = new EventEmitter<void>();
  @Output() location: EventEmitter<Location> = new EventEmitter<Location>();
  public locationCreateForm!: FormGroup;
  public selectedBuilding: Building = this.buildings[0];
  public wings: Wing[] = [];
  public locationTypes: LocationType[] = [
    LocationType.WORKPLACE,
    LocationType.ROOM
  ]
  public locationTypeTranslation = locationTypeTranslations;

  constructor(private locationService: LocationService, private wingService: WingService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getWings(this.buildings[0]);
    this.locationCreateForm = new FormGroup({
      'locationName': new FormControl(null, Validators.required),
      'locationType': new FormControl(this.locationTypes[0], Validators.required),
      'wing': new FormControl(this.wings[0], Validators.required),
      'building': new FormControl(this.buildings[0], Validators.required),
      'capacity': new FormControl(1, Validators.compose([Validators.required, Validators.min(1)]))
    })
  }

  private getWings(building: Building): void {
    this.wingService.getWingsByBuildingId(building.id)
    .subscribe((response: ApiResponse<Wing[]>) => {
      this.wings = response.payload;
      this.locationCreateForm.get('wing')?.setValue(this.wings[0]);
    });
  }

  public onChangeBuilding(): void {
    this.selectedBuilding = this.locationCreateForm.get('building')?.value
    this.getWings(this.locationCreateForm.get('building')?.value);
  }
  
  public onExitCreateMode(): void {
    this.exitCreateMode.emit();
  }

  public onSubmitForm(): void {
    if(this.locationCreateForm.invalid) {
      this.toastr.error('Vul alle velden in')
      return;
    }

    this.createLocation();
  }

  private createLocation(): void {
    const requestBody = {
      wing: this.locationCreateForm.get('wing')?.value,
      name: this.locationCreateForm.get('locationName')?.value,
      type: this.locationCreateForm.get('locationType')?.value,
      capacity: this.locationCreateForm.get('capacity')?.value
    }

    this.locationService.createNewLocation(requestBody)
    .subscribe((response: ApiResponse<Location>) => {
      this.toastr.success('De nieuwe werkplek is opgeslagen', 'Succes')
      this.location.emit(response.payload);
      this.onExitCreateMode();
    })
  }
}
