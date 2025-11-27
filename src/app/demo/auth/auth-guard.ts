import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const access_token = localStorage.getItem('access_token')

  if (access_token) {
    return true; // allow navigation
  } else {
    localStorage.removeItem('access_token');
    router.navigate(['/login']); // redirect if not authenticated
    return false;
  }
};
