import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.adminAuthService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/admin/login']);
    return false;
  }
} 