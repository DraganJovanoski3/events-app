import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
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
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const venueDetail = {
        ...this.venueForm.value,
        amenities: this.selectedAmenities,
        images: this.venueImages,
        businessHours: this.businessHours,
      };
      const username = userData.username

      const payload = {
        username: username,
        venueDetail: venueDetail,
        localName: this.venueForm.value.name,
        localEmail: this.venueForm.value.email
      };

      const baseUrl = 'https://4200-idx-events-appgit-1744414439711.clustered-workload.jawstf2k7vqy36oe6.cloudworkstations.dev';
      const url = new URL('/api/venue', baseUrl).toString();
      this.http.put(url, payload).subscribe({
        next: (response) => {
          console.log('Venue data updated successfully:', response);
          localStorage.setItem('venueData', JSON.stringify(venueDetail));
          this.router.navigate(['/dashboard']);
        },
        error: (error) => console.error('Error updating venue data:', error),
      });
    }
  }
}