import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CommonService } from 'src/app/services/common-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const commonService = inject(CommonService);
  const router = inject(Router);
  const http: HttpClient = inject(HttpClient);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 0) {
        const isContinue = confirm("Are You sure you want to continue");
        if (isContinue) {
          commonService.tokenExpired$.next(true)
          const auth = {
            refreshToken: localStorage.getItem("access_token")
          }
          http.post(`http://localhost:9090/v1/auth/refresh-token`, auth)
            .subscribe((res: any) => {
              if (res.status === 'success') {
                localStorage.setItem('access_token', res.data.accessToken);
                commonService.tokenRecieved$.next(true);
              }
            })

        } else {
          router.navigate(['/login']);
        }
      }
      return throwError(error);
    })
  );

};


