import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-venue-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './venue-wizard.component.html',
  styleUrl: './venue-wizard.component.scss'
})
export class VenueWizardComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  venueForm: FormGroup;
  venueImages: string[] = [];
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

  constructor(private fb: FormBuilder, private router: Router) {
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
      businessHours: this.fb.array(this.businessHours.map(hour => 
        this.fb.group({
          day: [hour.day],
          open: [hour.open],
          close: [hour.close]
        })
      ))
    });
  }

  ngOnInit() {
    // Load user data if available
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.role !== 'bar') {
      this.router.navigate(['/dashboard']);
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
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

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.venueImages.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeImage(index: number) {
    this.venueImages.splice(index, 1);
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
      const venueData = {
        ...this.venueForm.value,
        amenities: this.selectedAmenities,
        images: this.venueImages,
        businessHours: this.businessHours
      };
      
      console.log('Venue data to submit:', venueData);
      // Here you would send the data to your backend
      
      // For now, just navigate back to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
} 