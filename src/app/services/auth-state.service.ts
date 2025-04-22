import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isLoggedInSignal = signal(this.getStoredLoginState());
  private usernameSignal = signal(this.getStoredUsername());

  constructor() {
    // Initialize from localStorage
    this.isLoggedInSignal.set(this.getStoredLoginState());
    this.usernameSignal.set(this.getStoredUsername());
  }

  private getStoredLoginState(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  private getStoredUsername(): string {
    return localStorage.getItem('username') || '';
  }

  isLoggedIn() {
    return this.isLoggedInSignal();
  }

  getUsername() {
    return this.usernameSignal();
  }

  login(username: string) {
    this.isLoggedInSignal.set(true);
    this.usernameSignal.set(username);
    // Store in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  }

  logout() {
    this.isLoggedInSignal.set(false);
    this.usernameSignal.set('');
    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  }
} 