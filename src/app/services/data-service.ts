import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:9090/v2';

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(error => {
        console.error(`Error fetching data from ${endpoint}:`, error);
        return throwError(() => new Error(`Failed to fetch data from ${endpoint}`));
      })
    );
  }
  // get1<T>(endpoint: string): Observable<T> {
  //   return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
  //     catchError(error => {
  //       console.error(`Error fetching data from ${endpoint}:`, error);
  //       return throwError(() => new Error(`Failed to fetch data from ${endpoint}`));
  //     })
  //   );
  // }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(error => {
        console.error(`Error posting data to ${endpoint}:`, error);
        return throwError(() => new Error(`Failed to post data to ${endpoint}`));
      })
    );
  }

  update<T>(endpoint: string, id: number): Observable<T> {
    const fullUrl = `${this.baseUrl}/${endpoint}/${id}/false`;
    return this.http.patch<T>(fullUrl, null);
  }
  delete = (url: string) => {
    console.log(`URL :: ${this.baseUrl}${url}`)
    return this.http.delete(`${this.baseUrl}${url}`);
  }
}
