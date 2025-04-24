import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Auth guard checking route:', route.url);
  console.log('Route data:', route.data);

  const currentUser = authService.getCurrentUser();
  console.log('Current user in auth guard:', currentUser);
  
  if (!currentUser) {
    console.log('No current user, redirecting to login');
    return router.createUrlTree(['/login']);
  }

  // Check if route requires venue owner
  if (route.data['requiresVenueOwner'] && currentUser.role !== 'bar') {
    console.log('Route requires venue owner but user is not a bar owner, redirecting to dashboard');
    return router.createUrlTree(['/dashboard']);
  }

  console.log('Auth guard passed, allowing navigation');
  return true;
};
