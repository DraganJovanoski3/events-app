// event-list.component.ts (snippet)
import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  userCity: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // You can implement a method to determine the city from the coordinates.
          this.userCity = this.getCityFromCoordinates(latitude, longitude);
          this.loadEvents(this.userCity);
        },
        (error) => {
          console.error('Error getting location', error);
          // Optionally, load default events or prompt user for a city.
          this.loadEvents();
        }
      );
    } else {
      // Geolocation is not supported
      this.loadEvents();
    }
  }

  // Dummy function – replace with a proper reverse geocoding API call or logic
  getCityFromCoordinates(lat: number, lon: number): string {
    // Replace with a proper reverse geocoding API call or logic
    // Example: decide based on hard-coded coordinate ranges

    // In practice, you might call an external API like Google Maps or Nominatim
    if (lat > 41.1 && lat < 41.2 && lon > 19.6 && lon < 19.7) {
      return 'Ohrid';
    } else {
      return 'Skopje';
    }
  }

  loadEvents(city?: string): void {
    this.eventService.getEvents(city).subscribe((data: any[]) => {
      if (data) {

        this.events = data;
      } else {
        console.error('No events found for the specified city.');
      }

      }, error => {
        console.error('Registration failed', error);
        // Optionally, show an error message to the user
      });

  }
}
