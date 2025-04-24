// event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  hasTickets: boolean;
  price: number;
  capacity: number;
  venueId: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3001/events';

  constructor(private http: HttpClient) {}

  getEventsByVenue(venueId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/venue/${venueId}`);
  }

  getEvents(city?: string): Observable<Event[]> {
    const url = city ? `${this.apiUrl}?city=${city}` : this.apiUrl;
    return this.http.get<Event[]>(url);
  }

  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
