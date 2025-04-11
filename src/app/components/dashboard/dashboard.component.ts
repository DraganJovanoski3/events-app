import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      // Get user data from localStorage
      const userDataStr = localStorage.getItem('userData');
      console.log('Raw User Data from localStorage:', userDataStr);
      
      if (!userDataStr) {
        this.errorMessage = 'No user data found. Please log in again.';
        this.isLoading = false;
        return;
      }
      
      const userData = JSON.parse(userDataStr);
      console.log('Parsed User Data:', userData);
      
      if (!userData || !userData.username) {
        this.errorMessage = 'Invalid user data. Please log in again.';
        this.isLoading = false;
        return;
      }
      
      this.userRole = userData.role || 'user'; // Default to 'user' if role is missing
      this.username = userData.username;
      console.log('User Role:', this.userRole);
      console.log('Username:', this.username);

      // Check if user has already set up a venue
      const venueDataStr = localStorage.getItem('venueData');
      console.log('Raw Venue Data from localStorage:', venueDataStr);
      
      if (venueDataStr) {
        try {
          const parsedVenueData = JSON.parse(venueDataStr);
          this.hasVenue = !!parsedVenueData && Object.keys(parsedVenueData).length > 0;
          console.log('Has Venue:', this.hasVenue);
        } catch (e) {
          console.error('Error parsing venue data:', e);
          this.hasVenue = false;
        }
      } else {
        console.log('No venue data found in localStorage');
        this.hasVenue = false;
      }
      
      // For debugging - log the final state
      console.log('Final state - User Role:', this.userRole);
      console.log('Final state - Has Venue:', this.hasVenue);
      
      // Force hasVenue to false for new users with 'bar' role to ensure setup card is shown
      if (this.userRole === 'bar' && !this.hasVenue) {
        console.log('New venue owner detected - showing setup card');
        this.hasVenue = false;
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      this.errorMessage = 'An error occurred while loading your dashboard. Please try refreshing the page.';
    } finally {
      this.isLoading = false;
    }
  }

  navigateToVenueWizard() {
    console.log('Navigating to venue wizard');
    this.router.navigate(['/venue-wizard']);
  }
  
  navigateToLogin() {
    console.log('Navigating to login page');
    this.router.navigate(['/login']);
  }
}
