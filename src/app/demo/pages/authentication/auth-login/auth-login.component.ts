// project import
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/model/login';
import { requestResponse } from 'src/app/model/requestResponse';
import { DataService } from 'src/app/services/data-service';
import { filter, switchMap, tap } from 'rxjs/operators';

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
      filter((res: any) => res.status === 'success'),
      tap(res => {
        localStorage.setItem('access_token', res.data.accessToken);
        localStorage.setItem('refresh_token', res.data.refreshToken);
      }),
      switchMap(() => this.getCurrentUserInfo())
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/default']);
      },
      error: err => {
        console.error('Login flow failed', err);
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
