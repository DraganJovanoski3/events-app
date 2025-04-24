import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="venues-container">
      <h1>Our Venues</h1>
      <div class="venues-grid">
        <mat-card *ngFor="let venue of venues" class="venue-card">
          <img mat-card-image [src]="venue.image" [alt]="venue.name">
          <mat-card-content>
            <h2>{{ venue.name }}</h2>
            <p>{{ venue.description }}</p>
            <p><mat-icon>location_on</mat-icon> {{ venue.location }}</p>
            <p><mat-icon>people</mat-icon> Capacity: {{ venue.capacity }} people</p>
            <p><mat-icon>star</mat-icon> Rating: {{ venue.rating }}/5</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/venues', venue.id]">View Details</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .venues-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .venues-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .venue-card {
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      img {
        height: 200px;
        object-fit: cover;
      }

      mat-card-content {
        padding: 1rem;

        h2 {
          margin: 0 0 0.5rem 0;
          color: #1976d2;
        }

        p {
          margin: 0.5rem 0;
          color: #666;
          display: flex;
          align-items: center;
          gap: 0.5rem;

          mat-icon {
            font-size: 18px;
            height: 18px;
            width: 18px;
          }
        }
      }

      mat-card-actions {
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
      }
    }
  `]
})
export class VenuesComponent {
  venues = [
    {
      id: 1,
      name: 'Grand Ballroom',
      description: 'Elegant venue perfect for weddings and corporate events.',
      image: 'https://via.placeholder.com/300x200',
      location: '123 Main Street',
      capacity: 500,
      rating: 4.5
    },
    {
      id: 2,
      name: 'Tech Hub',
      description: 'Modern space designed for tech conferences and meetups.',
      image: 'https://via.placeholder.com/300x200',
      location: '456 Innovation Drive',
      capacity: 300,
      rating: 4.8
    }
  ];
} 