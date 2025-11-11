import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('token')

  if (token) {
    return true; // allow navigation
  } else {
    localStorage.removeItem('token');
    router.navigate(['/login']); // redirect if not authenticated
    return false;
  }
};
