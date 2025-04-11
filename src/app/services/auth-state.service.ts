import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<any>({});

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userData$ = this.userDataSubject.asObservable();

  constructor() {
    // Initialize from localStorage
    this.checkAuthState();
  }

  checkAuthState() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.isLoggedInSubject.next(!!token);
    this.userDataSubject.next(userData);
  }

  setLoggedIn(userData: any) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userData', JSON.stringify({
      username: userData.username,
      role: userData.role || 'user'
    }));
    this.checkAuthState();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.isLoggedInSubject.next(false);
    this.userDataSubject.next({});
  }
} 