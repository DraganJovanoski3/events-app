import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Event {
  id: number;
  title: string;
  date: Date;
  venue: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe]
})
export class HomeComponent implements OnInit {
  events: Event[] = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: new Date('2024-07-15'),
      venue: 'Central Park Arena',
      image: '/assets/images/events/music-festival.jpg'
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      date: new Date('2024-06-20'),
      venue: 'Innovation Center',
      image: '/assets/images/events/tech-conference.jpg'
    },
    {
      id: 3,
      title: 'Food & Wine Expo',
      date: new Date('2024-08-05'),
      venue: 'Grand Convention Center',
      image: '/assets/images/events/food-expo.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Additional initialization if needed
  }
} 