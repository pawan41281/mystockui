import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient = inject(HttpClient)
  private httpBackend = inject(HttpBackend);
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);
  private baseUrl = 'http://localhost:9090/v1';
  constructor() { }

  get accessToken() {
    return localStorage.getItem('access_token');
  }

  get refreshToken() {
    return localStorage.getItem('refresh_token');
  }

  saveTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  login(payload: { email: string; password: string }) {
    return this.http.post('/auth/login', payload).pipe(
      tap((res: any) => {
        this.saveTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  refreshAccessToken1(): Observable<any> {
    this.refreshing = true;

    return this.http.post(`${this.baseUrl}/auth/refresh-token`, {
      refreshToken: this.accessToken
    })
      .pipe(
        tap((res: any) => {
          this.saveTokens(res.accessToken, res.refreshToken);
          this.refreshing = false;
          this.refreshSubject.next(res.accessToken); // notify waiting requests
        })
      );
  }

  refreshAccessToken(): Observable<any> {
    const httpNoInterceptor = new HttpClient(this.httpBackend);

    return httpNoInterceptor.post(`${this.baseUrl}/auth/refresh-token`, {
      refreshToken: this.refreshToken   // correct token
    }).pipe(
      tap((res: any) => {
        this.saveTokens(res.accessToken, res.refreshToken);
        this.refreshing = false;
        this.refreshSubject.next(res.accessToken);
      })
    );
  }


  onRefreshDone() {
    return this.refreshSubject.asObservable();
  }
}
