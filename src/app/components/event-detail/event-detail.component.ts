import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  price?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe]
})
export class EventDetailComponent {
  event: Event | null = null;
  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(parseInt(eventId, 10));
    } else {
      this.error = 'Event ID not provided';
      this.isLoading = false;
    }
  }

  loadEvent(id: number): void {
    // TODO: Implement actual event loading from service
    this.isLoading = true;
    setTimeout(() => {
      this.event = {
        id: 1,
        title: 'Sample Event',
        description: 'This is a sample event description.',
        date: new Date(),
        location: 'Sample Location',
        category: 'Music',
        price: '$20',
        imageUrl: 'assets/default-event.jpg'
      };
      this.isLoading = false;
    }, 1000);
  }

  buyTickets(): void {
    if (!this.event) return;
    
    // TODO: Implement actual ticket purchase logic
    console.log('Buying tickets for event:', this.event.id);
  }
}
