import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  // Check if route requires venue owner
  if (route.data['requiresVenueOwner'] && currentUser.role !== 'bar') {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
