import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthStateService } from '../services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isLoggedIn = false;
  userRole = '';
  username = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authState: AuthStateService
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.subscriptions.push(
      this.authState.isLoggedIn$.subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      ),
      this.authState.userData$.subscribe(userData => {
        this.userRole = userData.role || '';
        this.username = userData.username || '';
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Prevent body scrolling when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  logout() {
    this.authState.logout();
    this.router.navigate(['/home']);
  }
}
