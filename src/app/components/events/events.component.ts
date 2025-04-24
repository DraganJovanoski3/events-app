import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="events-container">
      <h1>Upcoming Events</h1>
      <div class="events-grid">
        <mat-card *ngFor="let event of events" class="event-card">
          <img mat-card-image [src]="event.image" [alt]="event.title">
          <mat-card-content>
            <h2>{{ event.title }}</h2>
            <p>{{ event.description }}</p>
            <p><mat-icon>location_on</mat-icon> {{ event.venue }}</p>
            <p><mat-icon>event</mat-icon> {{ event.date | date:'medium' }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/events', event.id]">View Details</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .events-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .event-card {
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
export class EventsComponent {
  events = [
    {
      id: 1,
      title: 'Summer Music Festival',
      description: 'Join us for a weekend of amazing music and performances.',
      image: 'https://via.placeholder.com/300x200',
      venue: 'Central Park',
      date: new Date('2024-07-15')
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      description: 'The biggest tech conference of the year.',
      image: 'https://via.placeholder.com/300x200',
      venue: 'Convention Center',
      date: new Date('2024-08-20')
    }
  ];
} 