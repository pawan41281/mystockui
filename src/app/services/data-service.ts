import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  http: HttpClient = inject(HttpClient);

  private baseUrl = 'http://localhost:9090/v1';

  get<T>(endpoint: string): Observable<T> {

    // return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
    //   catchError(error => {
    //     console.error(`Error fetching data from ${endpoint}:`, error);
    //     return throwError(() => new Error(`Failed to fetch data from ${endpoint}`));
    //   })
    // );

    const token = localStorage.getItem('token')

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { headers }).pipe(
      catchError(error => {
        console.error(`Error fetching data from ${endpoint}:`, error);
        return throwError(() => new Error(`Failed to fetch data from ${endpoint}`));
      })
    );
  }


  post<T>(endpoint: string, data: any): Observable<T> {

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(error => {
        console.error(`Error posting data to ${endpoint}:`, error);
        return throwError(() => new Error(`Failed to post data to ${endpoint}`));
      })
    );
  }

  patch<T>(endpoint: string, id: number, status: boolean): Observable<T> {
    const fullUrl = `${this.baseUrl}/${endpoint}/${id}/${status}`;
    return this.http.patch<T>(fullUrl, null);
  }
  delete = (url: string) => {
    return this.http.delete(`${this.baseUrl}/${url}`);
  }
}
