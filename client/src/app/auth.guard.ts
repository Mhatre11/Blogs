import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  // Check if the route requires admin role
  if (route.data?.['requiresAdmin'] && !authService.isAdmin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
