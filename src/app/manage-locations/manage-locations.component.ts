import { Component, OnInit } from '@angular/core';
import { LocationComponent } from "./location/location.component";
import { LocationService } from '../shared/service/location.service';
import { ApiResponse } from '../shared/service/api.service';
import { CommonModule } from '@angular/common';
import { Location } from '../shared/model/location.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Building } from '../shared/model/building.model';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { CreateLocationComponent } from "./create-location/create-location.component";
import { BuildingService } from '../shared/service/building.service';

@Component({
    selector: 'app-manage-locations',
    standalone: true,
    templateUrl: './manage-locations.component.html',
    styleUrl: './manage-locations.component.scss',
    imports: [LocationComponent, CommonModule, FormsModule, LucideAngularModule, ReactiveFormsModule, CreateLocationComponent]
})
export class ManageLocationsComponent implements OnInit {
    public locations: Location[] = [];
    public searchQuery: string = '';
    public buildings: Building[] = [];
    public selectedBuilding!: Building;
    public isCreateMode: boolean = false;
    
    constructor(private locationService: LocationService, private buildingService: BuildingService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getBuildings();
    }

    public getBuildings(): void {
        this.buildingService.getAllBuildings()
            .subscribe((response: ApiResponse<Building[]>) => {
                this.buildings = response.payload;
                this.selectedBuilding = this.buildings[0];
                this.getLocationsByBuilding();
            })
    }

    private getLocationsByBuilding(): void {
        this.locationService.getLocationsByBuilding(this.selectedBuilding)
            .subscribe((response: ApiResponse<Location[]>) => {
                this.locations = response.payload;
            })
    }

    public filteredLocations(): Location[] {
        return this.locations.filter(location => 
            location.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            location.type.toLowerCase().includes(this.searchQuery.toLocaleLowerCase())
        );
    }

    public onChangeFilter(): void {
        this.getLocationsByBuilding();
    }

    public onChangeCreateMode(): void {
        this.isCreateMode = !this.isCreateMode;
    }
}
