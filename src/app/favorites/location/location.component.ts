import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/service/requests/user.service';
import { User } from '../../shared/model/user.model';
import { CommonModule, NgForOf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { SearchPipe } from '../../shared/pipe/searchItem.pipe';
import { Building } from '../../shared/model/building.model';
import { Wing } from '../../shared/model/wing.model';
import { Floor } from '../../shared/model/floor.model';
import { FavoriteLocationService } from '../../shared/service/favorite-location.service';
import { StandardLocation } from '../../shared/model/standard-location.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgForOf,
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit {
  @Input()
  public favoriteLocation!: Wing;

  public faChevronDown = faChevronDown;

  public favoriteLocationForm!: FormGroup;

  public buildingList!: Building[];
  public wingList!: Wing[];
  public filteredWingList!: Wing[];
  public floorList!: Floor[];

  constructor(
    private favoriteLocationService: FavoriteLocationService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getBuildingInformation();
    this.initiateForm();
    this.addEventListeners();
  }

  initiateForm() {
    this.favoriteLocationForm = this.formBuilder.group({
      building: [null, Validators.required],
      wing: [null, Validators.required],
      floor: [null, Validators.required],
    });
  }

  addEventListeners(): void {
    this.favoriteLocationForm
      .get('building')
      ?.valueChanges.subscribe((value) => {
        if (this.favoriteLocationForm.get('wing')?.value != null) { 
          this.getFloorInformation(this.filteredWingList[0].name); 
          this.favoriteLocationForm.get('wing')?.setValue(this.filteredWingList[0].name);
        }

        this.getWingInformation(value);
      });

    this.favoriteLocationForm.get('wing')?.valueChanges.subscribe((value) => {
      this.getFloorInformation(value);
    });
  }

  getBuildingInformation() {
    this.favoriteLocationService.getBuildingList().subscribe(
      (response) => {
        this.buildingList = response.payload;
      },
      (error) => {
        console.error('Error fetching building list: ', error);
      }
    );
  }

  getWingInformation(buildingId: string) {
    this.favoriteLocationService.getWingList(buildingId).subscribe(
      (response) => {
        this.wingList = response.payload;
        this.filterWingList(response.payload);
      },
      (error) => {
        console.error('Error fetching wing list: ', error);
      }
    );
  }

  filterWingList(wingList: Wing[]) {
    this.filteredWingList = wingList.filter(
      (wing, index, self) =>
        index === self.findIndex((t) => t.name === wing.name)
    );
  }

  getFloorInformation(wingName: string) {
    console.log('Wing name: ', wingName);

    if (wingName == null) {
      return;
    }

    let tempFilteredWingList = this.wingList.filter(
      (wing) => wing.name === wingName
    );

    let tempFloorList: Floor[] = [];

    for (let i = 0; i < tempFilteredWingList.length; i++) {
      tempFloorList.push(tempFilteredWingList[i].floor);
    }

    this.floorList = tempFloorList;

    console.log('Floor list: ', this.floorList);
  }

  submitFavoritesForm() {
    if (
      this.favoriteLocationForm.get('building')?.value ==
        this.favoriteLocation.floor.building.id &&
      this.favoriteLocationForm.get('wing')?.value ==
        this.favoriteLocation.id &&
      this.favoriteLocationForm.get('floor')?.value ==
        this.favoriteLocation.floor.id
    ) {
      this.toastr.info('Geen wijzigingen gedetecteerd');
    }
  }
}
