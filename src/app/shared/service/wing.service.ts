import {Injectable} from "@angular/core";
import {ApiResponse, ApiService, Endpoint} from "./api.service";
import {Wing} from "../model/wing.model";
import { Observable, catchError } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class WingService {

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  public getWingsByFloorId(floorId: string) {
    return this.apiService.get<ApiResponse<Wing[]>>(`/wing/floor/${floorId}`);
  }

  public getWingsByBuildingId(id: string): Observable<ApiResponse<Wing[]>> {
    return this.apiService.get<ApiResponse<Wing[]>>(`${Endpoint.BUILDING}/${id}/wing`)
    .pipe(
      catchError((error) => {
        this.toastr.error('Er is iets misgegaan bij het ophalen van de data', 'Error');
        throw error;
      })
    )
  }
}
