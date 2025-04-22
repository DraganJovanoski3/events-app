import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  username: string = '';
  hasVenue = false;
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe({
      next: (user) => {
        if (!user) {
          this.errorMessage = 'No user data found. Please log in again.';
          this.isLoading = false;
          return;
        }

        console.log('User data received:', user);
        this.userRole = user.role || 'user';
        this.username = user.username;
        
        // Check if user has venue data
        if (this.userRole === 'bar') {
          // Check both bar_detail and venueData in localStorage
          const venueData = localStorage.getItem('venueData');
          this.hasVenue = !!user.bar_detail || !!venueData;
          console.log('Venue status:', {
            bar_detail: user.bar_detail,
            venueData: venueData,
            hasVenue: this.hasVenue
          });
        }
        
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error getting user data:', error);
        this.errorMessage = 'An error occurred while loading your dashboard. Please try refreshing the page.';
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  navigateToVenueWizard() {
    this.router.navigate(['/venue-wizard']);
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
