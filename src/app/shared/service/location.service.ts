import { Injectable } from "@angular/core";
import { ApiResponse, ApiService, Endpoint } from "./api.service";
import { Observable, catchError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Location } from "../model/location.model";
import { Building } from "../model/building.model";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private apiService: ApiService, private toastr: ToastrService){}

  public getAllLocations(): Observable<ApiResponse<Location[]>> {
    return this.apiService.get<ApiResponse<Location[]>>(Endpoint.LOCATION)
    .pipe(
      catchError((error) => {
        this.toastr.error('Er is iets misgegaan bij het ophalen van de data', 'Error');
        throw error;
      })
    )
  }

  public getLocationsByBuilding(building: Building): Observable<ApiResponse<Location[]>> {
    const buildingName = building.name;
    let params = new HttpParams;

    params = params.set('buildingName', buildingName);

    return this.apiService.get<ApiResponse<Location[]>>(`${Endpoint.LOCATION}/admin`, {params: params})
    .pipe(
      catchError((error) => {
        this.toastr.error('Er is iets misgegaan bij het ophalen van de data', 'Error');
        throw error;
      })
    )
  }

  public createNewLocation(requestBody: Object): Observable<ApiResponse<Location>> {
    return this.apiService.post<ApiResponse<any>>(`${Endpoint.LOCATION}/create`, {body: requestBody})
    .pipe(
      catchError((error) => {
        this.toastr.error('Er is iets misgegaan bij het opslaan van de werkplek', 'Error');
        throw error;
      })
    )
  }

  public updateLocation(id: string, requestBody: Object): Observable<ApiResponse<Location>> {
    return this.apiService.put<ApiResponse<any>>(`${Endpoint.LOCATION}/${id}/edit`, {body: requestBody})
    .pipe(
      catchError((error) => {
        this.toastr.error('Er is iets misgegaan bij het opslaan van de werkplek', 'Error');
        throw error;
      })
    )
  }

  public deleteLocation(id: string): Observable<ApiResponse<String>> {
    return this.apiService.delete<ApiResponse<String>>(`${Endpoint.LOCATION}/${id}/delete`)
    .pipe(
      catchError((error) => {
        this.toastr.error('Er is iets misgegaan tijdens het verwijderen van de werkplek', 'Error');
        throw error;
      })
    )
  }
}
