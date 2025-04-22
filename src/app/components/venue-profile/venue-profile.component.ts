import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface VenueDetails {
  name: string;
  description: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  venueType: string;
  capacity: number;
  priceRange: string;
  amenities?: string[];
  images?: {
    profile?: string;
    cover?: string;
    gallery?: string[];
  };
  businessHours?: Record<string, { open: string; close: string }>;
}

@Component({
  selector: 'app-venue-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './venue-profile.component.html',
  styleUrls: ['./venue-profile.component.scss']
})
export class VenueProfileComponent implements OnInit {
  venueDetails: VenueDetails | null = null;
  isLoading = true;
  coverPhoto: string | null = null;
  profilePhoto: string | null = null;
  galleryPhotos: string[] = [];
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVenueProfile();
  }

  private loadVenueProfile() {
    this.isLoading = true;
    this.errorMessage = '';

    const currentUser = this.authService.getCurrentUser();
    console.log('Loading venue profile for user:', currentUser);

    if (!currentUser) {
      console.error('No user found');
      this.errorMessage = 'No user found. Please log in again.';
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    if (currentUser.role !== 'bar') {
      console.error('User is not a venue owner');
      this.errorMessage = 'You must be a venue owner to view this page.';
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
      return;
    }

    if (!currentUser.bar_detail) {
      console.error('No venue details found');
      this.errorMessage = 'No venue details found. Please set up your venue first.';
      this.isLoading = false;
      return;
    }

    try {
      this.venueDetails = JSON.parse(currentUser.bar_detail as string);
      console.log('Successfully loaded venue details:', this.venueDetails);

      // Handle images
      if (this.venueDetails?.images) {
        this.profilePhoto = this.venueDetails.images.profile || null;
        this.coverPhoto = this.venueDetails.images.cover || null;
        this.galleryPhotos = this.venueDetails.images.gallery || [];
        
        // If no specific profile/cover photos are set, use the first gallery photo
        if (!this.profilePhoto && this.galleryPhotos.length > 0) {
          this.profilePhoto = this.galleryPhotos[0];
        }
        if (!this.coverPhoto && this.galleryPhotos.length > 0) {
          this.coverPhoto = this.galleryPhotos[0];
        }
      }

      // Validate required fields
      if (!this.venueDetails?.name || !this.venueDetails?.description) {
        console.error('Missing required venue details');
        this.errorMessage = 'Venue details are incomplete. Please update your venue information.';
      }
    } catch (error) {
      console.error('Error parsing venue details:', error);
      this.errorMessage = 'Error loading venue details. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  getPriceRangeSymbols(priceRange: string): string {
    switch (priceRange) {
      case '$': return '$';
      case '$$': return '$$';
      case '$$$': return '$$$';
      case '$$$$': return '$$$$';
      default: return '';
    }
  }

  formatBusinessHours(): { day: string; hours: string }[] {
    if (!this.venueDetails?.businessHours) return [];
    
    const businessHours = this.venueDetails.businessHours as Record<string, { open: string; close: string }>;
    if (!businessHours || typeof businessHours !== 'object') return [];
    
    const entries = Object.entries(businessHours);
    if (!entries.length) return [];
    
    return entries.map(([day, hours]) => ({
      day,
      hours: `${hours.open} - ${hours.close}`
    }));
  }

  navigateToVenueWizard() {
    this.router.navigate(['/venue-wizard']);
  }

  refreshProfile() {
    this.loadVenueProfile();
  }

  openImage(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }
} 