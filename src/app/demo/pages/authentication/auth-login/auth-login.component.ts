// project import
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/model/login';
import { requestResponse } from 'src/app/model/requestResponse';
import { DataService } from 'src/app/services/data-service';
//import { filter, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, switchMap, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-auth-login',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {

  auth: Auth = new Auth()
  dataService = inject(DataService);
  router = inject(Router);
  errorMessage: string = ''
  url: string = 'auth/login';
  // public method
  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];

  login() {
    this.dataService.post(this.url, this.auth).pipe(

      tap((res: any) => {
        if (res.status === 'success') {
          localStorage.setItem('access_token', res.data.accessToken);
          localStorage.setItem('refresh_token', res.data.refreshToken);
        }
      }),

      filter((res: any) => res.status === 'success'),

      switchMap(() => this.getCurrentUserInfo()),

      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          // ✅ message sent by backend
          this.errorMessage =
            err.error?.message || 'Invalid username or password';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }

        console.error('Login failed:', err);
        return throwError(() => err); // optional
      })

    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/default']);
      }
    });
  }


  getCurrentUserInfo = () => {
    return this.dataService.post('users/currentuser', null).pipe(
      tap((res: any) => {
        localStorage.setItem('userInfo', JSON.stringify(res.data));
      })
    );
  }
}
