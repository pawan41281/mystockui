//import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
//import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  //const router = inject(Router);

  const newReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(newReq).pipe(
    catchError((error) => {

      // if (error.status === 401 || error.status === 0) {
      //   // Optionally clear token      
      //   localStorage.removeItem('token');
      //   // Redirect to login
      //   router.navigate(['/login']);
      // }

      return throwError(() => error);
    })
  );
};