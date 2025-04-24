import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface UserData {
  id: number;
  username: string;
  role: string;
  bar_detail?: string;
  local_name?: string;
  local_email?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Make sure this URL matches your Node.js back-end address and port.
  private apiUrl = 'http://localhost:3001';
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user data from localStorage on service initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Send registration data to the backend.
  register(userData: Omit<UserData, 'id'>): Observable<any> {
    console.log('Sending registration request:', userData);
    return this.http.post(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Send login credentials to the backend.
  login(credentials: LoginCredentials): Observable<any> {
    console.log('Sending login request:', credentials);
    return this.http.post(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response: any) => {
          if (response.user) {
            this.updateUser(response.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth service error:', error);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Simple check for whether a token exists.
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  updateUser(user: UserData): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
}
