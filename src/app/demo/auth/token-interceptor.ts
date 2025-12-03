import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common-service';
import { DataService } from 'src/app/services/data-service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("access_token");
  // const commonService = inject(CommonService);
  // const router = inject(Router);
  // const currentTimestamp = Date.now();
  // const dataService = inject(DataService);

  // const now = new Date();

  // if (req.url.includes('/auth/refresh-token')) {
  //   return next(req);
  // }

  // if (commonService.after5min && (currentTimestamp - commonService.after5min) > 0) {
  //   router.navigate(['/login']);
  // } else {
  //   dataService.post('auth/refresh-token', {
  //     refreshToken: token
  //   })
  //     .subscribe((res: any) => {
  //       if (res.status === 'success') {
  //         localStorage.setItem('access_token', res.data.accessToken);

  //       }
  //     })
  // }
  // commonService.after5min = new Date(now.getTime() + 1 * 60 * 1000);

  if (!token) return next(req);

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  return next(newReq);
};