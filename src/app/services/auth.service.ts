import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Make sure this URL matches your Node.js back-end address and port.
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  // Send registration data to the backend.
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Send login credentials to the backend.
  login(credentials: any): Observable<any> {
    // For testing purposes, if username contains 'bar', set role as 'bar'
    if (credentials.username.toLowerCase().includes('bar')) {
      return new Observable(subscriber => {
        subscriber.next({
          token: 'test-token',
          role: 'bar'
        });
        subscriber.complete();
      });
    }
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Simple check for whether a token exists.
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
