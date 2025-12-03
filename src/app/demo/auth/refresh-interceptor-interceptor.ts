import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { DataService } from 'src/app/services/data-service';


let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const refreshInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(DataService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {

      if ((err.status === 401 || err.status === 0) && !req.url.includes('login')) {

        if (!isRefreshing) {
          isRefreshing = true;

          return authService.refreshToken().pipe(

            switchMap((res: any) => {
              isRefreshing = false;
              localStorage.setItem('access_token', res.data.accessToken);
              localStorage.setItem('refresh_token', res.data.refreshToken);
              refreshTokenSubject.next(res.data.accessToken);

              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.data.accessToken}`
                }
              });

              return next(newReq);
            },),
            catchError(refreshError => {
              isRefreshing = false;
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );

        } else {
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              });
              return next(newReq);
            })
          );
        }
      }

      return throwError(() => err);
    })
  );
};
function delay(arg0: number): import("rxjs").OperatorFunction<any, any> {
  throw new Error('Function not implemented.');
}

