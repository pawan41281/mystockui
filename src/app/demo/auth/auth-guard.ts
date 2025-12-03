import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const access_token = localStorage.getItem('access_token')

  if (!access_token) {
    localStorage.removeItem('access_token');
    router.navigate(['/login']); // redirect if not authenticated
    return false;
  }
  return true;
};
