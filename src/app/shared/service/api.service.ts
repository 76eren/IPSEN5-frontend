import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';

export enum Endpoint {
  LOGIN = '/login',
  LOCATION = '/location',
  BUILDING = '/building',
  REPORTS = '/reports',
}

export interface ApiResponse<T> {
  payload: T;
  message: string;
  statusCode: string;
}

export interface ApiResponse<T> {
  payload: T;
  message: string;
  statusCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public static API_URL = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * Creates a HTTP GET request tot the specified path.
   *
   * @param path - The URL path for the request.
   * @param options - An object where you can add the headers and params for the request.
   * @returns - An observable of the specified type <T> representing the response data.
   *
   * @remarks
   * This function appends an 'Authorization' header to the request using the JWT token retrieved from the cookies.
   * If the headers or a body are not provided, default values will be used.
   */
  public get<T>(path: string, options?: { headers?: HttpHeaders, params?: HttpParams }): Observable<T> {
    let requestHeaders: HttpHeaders = options?.headers ?? new HttpHeaders();
    let requestParams: HttpParams = options?.params ?? new HttpParams();

    return this.http.get<T>(`${ApiService.API_URL}${path}`, { headers: requestHeaders, params: requestParams, withCredentials: true });
  }

  /**
   * Creates an HTTP POST request to the specified path with an optional request body.
   *
   * @param path - The URL path for the request.
   * @param options - An object where you can add the headers and body for the request.
   * @returns - An observable of the specified type <T> representing the response data.
   *
   * @remarks
   * This function appends an 'Authorization' header to the request using the JWT token retrieved from the cookies.
   * @param addAuthorizationHeader - When set to false a request will be sent without the 'Authorization' header. The default value is
   * set to true.
   *
   * If the headers or a body are not provided, default values will be used.
   */
  public post<T>(path: string, options?: { headers?: HttpHeaders, body?: object }): Observable<T> {
    let requestHeaders: HttpHeaders = options?.headers ?? new HttpHeaders();

    return this.http.post<T>(`${ApiService.API_URL}${path}`, options?.body, { headers: requestHeaders, withCredentials: true })
  }

  /**
   * Creates an HTTP PUT request to the specified path with an optional request body.
   *
   * @param path - The URL path for the request.
   * @param options - An object where you can add the headers and body for the request.
   * @returns - An observable of the specified type <T> representing the response data.
   *
   * @remarks
   * This function appends an 'Authorization' header to the request using the JWT token retrieved from the cookies.
   * If the headers or a body are not provided, default values will be used.
   */
  public put<T>(path: string, options?: {headers?: HttpHeaders, body?: object}): Observable<T> {
    let requestHeaders: HttpHeaders = options?.headers ?? new HttpHeaders();

    return this.http.put<T>(`${ApiService.API_URL}${path}`, options?.body, { headers: requestHeaders, withCredentials: true })
  }

  /**
   * Creates an HTTP PATCH request to the specified path with an optional request body.
   *
   * @param path - The URL path for the request.
   * @param options - An object where you can add the headers and body for the request.
   * @returns - An observable of the specified type <T> representing the response data.
   *
   * @remarks
   * This function appends an 'Authorization' header to the request using the JWT token retrieved from the cookies.
   * If the headers or a body are not provided, default values will be used.
   */
  public patch<T>(path: string, options?: { headers?: HttpHeaders, body?: object }): Observable<T> {
    let requestHeaders: HttpHeaders = options?.headers ?? new HttpHeaders();

    return this.http.patch<T>(`${ApiService.API_URL}${path}`, options?.body, { headers: requestHeaders, withCredentials: true });
  }

  /**
   * Creates an HTTP DELETE request to the specified path.
   *
   * @param path - The URL path for the request.
   * @param options - An object where you can add the headers for the request.
   * @returns - An observable of the specified type <T> representing the response data.
   *
   * @remarks
   * This function appends an 'Authorization' header to the request using the JWT token retrieved from the cookies.
   * If the headers or a body are not provided, default values will be used.
   */
  public delete<T>(path: string, options?: { headers?: HttpHeaders }): Observable<T> {
    let requestHeaders: HttpHeaders = options?.headers ?? new HttpHeaders();

    return this.http.delete<T>(`${ApiService.API_URL}${path}`, { headers: requestHeaders, withCredentials: true })
  }
}
