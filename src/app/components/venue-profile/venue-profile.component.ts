import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';

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
  imageLoadingStates: { [key: string]: boolean } = {};
  imageErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.loadVenueProfile();
  }

  private loadVenueProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to view venue details.';
      this.isLoading = false;
      return;
    }

    if (!currentUser.bar_detail) {
      this.errorMessage = 'No venue details found. Please set up your venue first.';
      this.isLoading = false;
      return;
    }

    try {
      console.log('Raw bar_detail:', currentUser.bar_detail);
      const venueDetails = JSON.parse(currentUser.bar_detail as string);
      console.log('Parsed venue details:', venueDetails);

      if (!venueDetails || typeof venueDetails !== 'object') {
        throw new Error('Invalid venue details format');
      }

      // Validate required fields
      const requiredFields: (keyof VenueDetails)[] = [
        'name', 'description', 'address', 'city', 'zipCode', 
        'phone', 'email', 'venueType', 'capacity', 'priceRange'
      ];

      const missingFields = requiredFields.filter(field => {
        const value = venueDetails[field];
        return value === undefined || value === null || value === '';
      });

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        this.errorMessage = `Venue details are incomplete. Missing: ${missingFields.join(', ')}. Please update your venue information.`;
        this.isLoading = false;
        return;
      }

      this.venueDetails = venueDetails;

      // Handle images
      if (venueDetails.images) {
        console.log('Processing images:', venueDetails.images);
        const images = venueDetails.images;
        
        // Set profile photo
        if (images.profile) {
          console.log('Setting profile photo');
          this.imageLoadingStates['profile'] = true;
          this.profilePhoto = this.imageService.decompressImage(images.profile);
          this.loadImage(this.profilePhoto, 'profile');
        } else if (images.gallery && images.gallery.length > 0) {
          console.log('Using first gallery photo as profile photo');
          this.imageLoadingStates['profile'] = true;
          this.profilePhoto = this.imageService.decompressImage(images.gallery[0]);
          this.loadImage(this.profilePhoto, 'profile');
        }

        // Set cover photo
        if (images.cover) {
          console.log('Setting cover photo');
          this.imageLoadingStates['cover'] = true;
          this.coverPhoto = this.imageService.decompressImage(images.cover);
          this.loadImage(this.coverPhoto, 'cover');
        } else if (images.gallery && images.gallery.length > 0) {
          console.log('Using first gallery photo as cover photo');
          this.imageLoadingStates['cover'] = true;
          this.coverPhoto = this.imageService.decompressImage(images.gallery[0]);
          this.loadImage(this.coverPhoto, 'cover');
        }

        // Set gallery photos
        if (images.gallery && Array.isArray(images.gallery)) {
          console.log('Setting gallery photos:', images.gallery.length);
          this.galleryPhotos = images.gallery.map((photo: string, index: number) => {
            const imageUrl = this.imageService.decompressImage(photo);
            this.imageLoadingStates[`gallery-${index}`] = true;
            this.loadImage(imageUrl, `gallery-${index}`);
            return imageUrl;
          });
        }
      } else {
        console.log('No images found in venue details');
      }

    } catch (error) {
      console.error('Error loading venue profile:', error);
      if (error instanceof SyntaxError) {
        this.errorMessage = 'Invalid venue data format. Please contact support.';
      } else if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Error loading venue details. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  private loadImage(imageUrl: string, imageKey: string) {
    const img = new Image();
    img.onload = () => {
      this.imageLoadingStates[imageKey] = false;
      delete this.imageErrors[imageKey];
    };
    img.onerror = () => {
      this.imageLoadingStates[imageKey] = false;
      this.imageErrors[imageKey] = 'Failed to load image';
      console.error(`Error loading image: ${imageKey}`);
    };
    img.src = imageUrl;
  }

  getImageLoadingState(imageKey: string): boolean {
    return this.imageLoadingStates[imageKey] || false;
  }

  getImageError(imageKey: string): string | null {
    return this.imageErrors[imageKey] || null;
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