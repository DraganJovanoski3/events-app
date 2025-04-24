import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private tokenKey = 'admin_token';
  private userKey = 'admin_user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public redirectUrl: string = '/admin/dashboard';

  constructor(private http: HttpClient) {
    this.checkAuthState();
  }

  private checkAuthState() {
    const token = localStorage.getItem(this.tokenKey);
    this.isAuthenticatedSubject.next(!!token);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
} 