// event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://your-backend-api.com/events';

  constructor(private http: HttpClient) {}

  getEvents(city?: string): Observable<any[]> {
    // Adjust the URL based on whether a city filter is applied
    const url = city ? `${this.apiUrl}?city=${city}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }
}
