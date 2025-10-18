// project import
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/model/login';
import { DataService } from 'src/app/services/data-service';

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
    this.dataService.post(this.url, this.auth)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          localStorage.setItem('token', res.data.accessToken);
          //this.getColorData();
          this.router.navigate(['/dashboard/default']);
        }
      })
  }
}
