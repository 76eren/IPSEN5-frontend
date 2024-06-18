import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {LucideAngularModule} from "lucide-angular";
import {RouterLink} from "@angular/router";
import {ColleguesComponent} from "./colleagues/colleagues.component";
import { LocationComponent } from "./location/location.component";
import { User } from "../shared/model/user.model"
import {FavoriteUserService} from "../shared/service/favorite-user.service";
import {FavoriteLocationService} from "../shared/service/favorite-location.service";
import {StandardLocation} from "../shared/model/standard-location.model";
import {ToastrService} from "ngx-toastr";
import { Wing } from '../shared/model/wing.model';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [
        DatePipe,
        LucideAngularModule,
        NgForOf,
        RouterLink,
        ColleguesComponent,
        LocationComponent
    ],
    templateUrl: './favorites.component.html',
    styleUrl: './favorites.component.scss'
})

export class FavoritesComponent implements OnInit {
    favoriteColleaguesList!: User[];
    favoriteBuildingList!: Wing;

    constructor(private favoriteUserService: FavoriteUserService,
                private favoriteLocationService: FavoriteLocationService,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.getFavoriteColleagues();
        this.getFavoriteBuilding();
    }

    getFavoriteColleagues(): void {
        this.favoriteUserService.getFavoriteColleagues().subscribe(
            (response) => {
                this.favoriteColleaguesList = response.payload;
            },
            (error) => {
                this.toastr.error("Probeer het later nog een keer", "Fout bij ophalen van favoriete collega's")
            }
        );
    }

    getFavoriteBuilding(): void {
        this.favoriteLocationService.getStandardLocation().subscribe(
            (response) => {
                this.favoriteBuildingList = response.payload;
            },
            (error) => {
                this.toastr.error("Probeer het later nog een keer", "Fout bij ophalen van favoriete locatie")
            }
        );
    }
}
