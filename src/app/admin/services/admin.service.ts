import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }

  getUsers(params: any = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { params });
  }

  getUserDetails(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  getAnalytics(params: any = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`, { params });
  }

  getRecentActivity(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activity/recent`);
  }

  getVenueStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/venues/stats`);
  }

  getEventStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/stats`);
  }

  getVisitorStats(params: any = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}/visitors/stats`, { params });
  }

  getSignupStats(params: any = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}/signups/stats`, { params });
  }
} 