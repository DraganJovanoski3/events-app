import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalVenues: 0,
    totalEvents: 0
  };
  recentActivity: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });

    this.adminService.getRecentActivity().subscribe({
      next: (data) => {
        this.recentActivity = data;
      },
      error: (error) => {
        console.error('Error loading recent activity:', error);
      }
    });
  }

  logout() {
    this.adminAuthService.logout();
    this.router.navigate(['/admin/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  getUser() {
    return this.adminAuthService.getUser();
  }
} 