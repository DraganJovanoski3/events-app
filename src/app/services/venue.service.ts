import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private apiUrl = `${environment.apiUrl}/venues`;

  constructor(private http: HttpClient) {}

  getVenueDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/details`);
  }

  createVenue(venueData: any): Observable<any> {
    return this.http.post(this.apiUrl, venueData);
  }

  updateVenue(venueData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/details`, venueData);
  }

  uploadImage(image: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', type);
    return this.http.post(`${this.apiUrl}/upload-image`, formData);
  }
} 