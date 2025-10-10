// import { HttpInterceptorFn } from '@angular/common/http';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

//   const token = localStorage.getItem("token");
//   const newReq = req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${token}`
//     }
//   })

//   console.log("request header :: ", newReq.headers.get('Authorization'))
//   return next(newReq);
// };


import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  const router = inject(Router);
  console.log('interceptor executing')

  const newReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(newReq).pipe(
    catchError((error) => {
      console.log('logout part is executing ')
      if (error.status === 401 || error.status === 0) {
        // Optionally clear token
        console.log('logout part is executing 401 ')
        localStorage.removeItem('token');

        // Redirect to login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};