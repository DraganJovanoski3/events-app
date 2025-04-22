import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface BusinessHours {
  open: string;
  close: string;
}

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
  images?: string[];
  businessHours?: Record<string, BusinessHours>;
  createdAt?: string;
  updatedAt?: string;
}

interface WizardStep {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-venue-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './venue-wizard.component.html',
  styleUrl: './venue-wizard.component.scss',
})
export class VenueWizardComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  venueForm: FormGroup;
  profilePhoto: string | null = null;
  coverPhoto: string | null = null;
  galleryPhotos: string[] = [];
  venueTypes = [
    'Bar', 'Club', 'Restaurant', 'Cafe', 'Pub', 'Lounge', 'Nightclub', 'Other'
  ];
  amenities = [
    'Wi-Fi', 'Parking', 'Live Music', 'Dance Floor', 'Outdoor Seating', 
    'Food Service', 'Bar Service', 'Stage', 'Sound System', 'Lighting',
    'VIP Area', 'Coat Check', 'Security', 'Accessibility', 'Air Conditioning'
  ];
  selectedAmenities: string[] = [];
  businessHours = [
    { day: 'Monday', open: '09:00', close: '17:00' },
    { day: 'Tuesday', open: '09:00', close: '17:00' },
    { day: 'Wednesday', open: '09:00', close: '17:00' },
    { day: 'Thursday', open: '09:00', close: '17:00' },
    { day: 'Friday', open: '09:00', close: '22:00' },
    { day: 'Saturday', open: '10:00', close: '22:00' },
    { day: 'Sunday', open: '10:00', close: '17:00' }
  ];
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  wizardSteps: WizardStep[] = [
    {
      title: 'Basic Information',
      description: 'Enter your venue\'s basic details',
      icon: 'info'
    },
    {
      title: 'Location & Contact',
      description: 'Add your venue\'s location and contact information',
      icon: 'location_on'
    },
    {
      title: 'Features & Hours',
      description: 'Set your amenities and business hours',
      icon: 'schedule'
    },
    {
      title: 'Photos & Finalize',
      description: 'Upload photos and complete your venue profile',
      icon: 'photo_camera'
    }
  ];

  completedSteps: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.venueForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      website: ['', Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$')],
      venueType: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      priceRange: ['', Validators.required],
      businessHours: this.fb.array(this.businessHours.map(hour => 
        this.fb.group({
          day: [hour.day],
          open: [hour.open],
          close: [hour.close]
        })
      ))
    });
  }

  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  get isFirstStep(): boolean {
    return this.currentStep === 1;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  get currentStepTitle(): string {
    return this.wizardSteps[this.currentStep - 1].title;
  }

  get currentStepDescription(): string {
    return this.wizardSteps[this.currentStep - 1].description;
  }

  ngOnInit() {
    // Check if user is a venue owner
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'bar') {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Initialize form with business hours controls
    const businessHoursControls = this.days.reduce((acc, day) => {
      acc[`${day}Open`] = ['09:00'];
      acc[`${day}Close`] = ['17:00'];
      return acc;
    }, {} as Record<string, [string]>);

    this.venueForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      venueType: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      priceRange: ['', Validators.required],
      ...businessHoursControls
    });

    // If user already has venue details, populate the form
    if (currentUser.bar_detail) {
      const venueDetails = JSON.parse(currentUser.bar_detail as string) as VenueDetails;
      const { businessHours, ...otherDetails } = venueDetails;
      
      this.venueForm.patchValue(otherDetails);
      
      // Set business hours
      if (businessHours) {
        Object.entries(businessHours).forEach(([day, hours]) => {
          this.venueForm.patchValue({
            [`${day}Open`]: hours.open,
            [`${day}Close`]: hours.close
          });
        });
      }

      // Set amenities
      if (venueDetails.amenities) {
        this.selectedAmenities = venueDetails.amenities;
      }

      // Set images
      if (venueDetails.images) {
        this.profilePhoto = venueDetails.images[0] || null;
        this.coverPhoto = venueDetails.images[0] || null;
        this.galleryPhotos = venueDetails.images;
      }
    }
  }

  isStepCompleted(stepNumber: number): boolean {
    return this.completedSteps.has(stepNumber);
  }

  canNavigateToStep(stepNumber: number): boolean {
    // Can navigate to current step or any completed step
    return stepNumber === this.currentStep || this.isStepCompleted(stepNumber);
  }

  navigateToStep(stepNumber: number) {
    if (this.canNavigateToStep(stepNumber)) {
      this.currentStep = stepNumber;
      window.scrollTo(0, 0);
    }
  }

  validateStep(stepNumber: number): boolean {
    const stepFields = this.getStepFields(stepNumber);
    let isValid = true;

    stepFields.forEach(field => {
      const control = this.venueForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    if (isValid) {
      this.completedSteps.add(stepNumber);
    }

    return isValid;
  }

  getStepFields(stepNumber: number): string[] {
    switch (stepNumber) {
      case 1:
        return ['name', 'description', 'venueType', 'capacity', 'priceRange'];
      case 2:
        return ['address', 'city', 'zipCode', 'phone', 'email', 'website'];
      case 3:
        return ['businessHours'];
      case 4:
        return [];
      default:
        return [];
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.validateStep(this.currentStep)) {
        this.currentStep++;
        window.scrollTo(0, 0);
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  toggleAmenity(amenity: string) {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index === -1) {
      this.selectedAmenities.push(amenity);
    } else {
      this.selectedAmenities.splice(index, 1);
    }
  }

  onFileSelected(event: any, type: 'profile' | 'cover' | 'gallery') {
    const files = event.target.files;
    if (files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        switch (type) {
          case 'profile':
            this.profilePhoto = imageUrl;
            break;
          case 'cover':
            this.coverPhoto = imageUrl;
            break;
          case 'gallery':
            this.galleryPhotos.push(imageUrl);
            break;
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }

  removeImage(type: 'profile' | 'cover' | 'gallery', index?: number) {
    switch (type) {
      case 'profile':
        this.profilePhoto = null;
        break;
      case 'cover':
        this.coverPhoto = null;
        break;
      case 'gallery':
        if (index !== undefined) {
          this.galleryPhotos.splice(index, 1);
        }
        break;
    }
  }

  updateBusinessHours(day: string, type: 'open' | 'close', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const index = this.businessHours.findIndex(hour => hour.day === day);
    if (index !== -1) {
      this.businessHours[index][type] = value;
    }  
  }

  submitVenue() {
    if (this.venueForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('No user logged in');
        return;
      }

      // Log form values
      console.log('Form values:', this.venueForm.value);
      console.log('Selected amenities:', this.selectedAmenities);

      // Prepare business hours data
      const businessHours = this.days.reduce((acc, day) => {
        acc[day] = {
          open: this.venueForm.get(`${day}Open`)?.value || '09:00',
          close: this.venueForm.get(`${day}Close`)?.value || '17:00'
        };
        return acc;
      }, {} as Record<string, { open: string; close: string }>);

      console.log('Business hours:', businessHours);

      // Prepare the venue details
      const venueDetail = {
        ...this.venueForm.value,
        amenities: this.selectedAmenities,
        businessHours: this.businessHours,
        images: {
          profile: this.profilePhoto || null,
          cover: this.coverPhoto || null,
          gallery: this.galleryPhotos
        }
      };

      // Prepare the payload for the API
      const payload = {
        username: currentUser.username,
        barDetail: JSON.stringify(venueDetail),
        localName: this.venueForm.value.name,
        localEmail: this.venueForm.value.email,
        role: 'bar',
        status: 'active'
      };

      console.log('Final payload:', payload);

      // Make the API call to update venue details
      this.http.put('http://localhost:3001/api/venue', payload).subscribe({
        next: (response: any) => {
          console.log('Venue data updated successfully:', response);
          
          // Update the current user with the new venue data
          const updatedUser = {
            ...currentUser,
            bar_detail: JSON.stringify(venueDetail),
            local_name: this.venueForm.value.name,
            local_email: this.venueForm.value.email,
            role: 'bar',
            status: 'active'
          };
          
          // Update the user in AuthService
          this.authService.updateUser(updatedUser);
          
          // Show success message
          alert('Venue details saved successfully!');
          
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating venue data:', error);
          console.error('Error details:', error.error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          
          let errorMessage = 'Failed to save venue details. Please try again.';
          
          // Check for missing fields in the error response
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && error.error.errors) {
            const missingFields = Object.keys(error.error.errors)
              .filter(key => error.error.errors[key].kind === 'required')
              .map(key => `- ${key}`)
              .join('\n');
            
            if (missingFields) {
              errorMessage = `Please fill in the following required fields:\n${missingFields}`;
            }
          }
          
          alert(errorMessage);
        }
      });
    } else {
      // Get all invalid fields
      const invalidFields = Object.keys(this.venueForm.controls)
        .filter(key => this.venueForm.controls[key].invalid)
        .map(key => `- ${key}`)
        .join('\n');
      
      // Mark all form controls as touched to show validation errors
      Object.keys(this.venueForm.controls).forEach(key => {
        this.venueForm.get(key)?.markAsTouched();
      });
      
      alert(`Please fill in the following required fields correctly:\n${invalidFields}`);
    }
  }
}