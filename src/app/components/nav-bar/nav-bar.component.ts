import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavBarComponent {
  isMenuOpen = false;
  isLoggedIn = false;
  username = '';
  userRole = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
      this.userRole = user?.role || '';
      console.log('NavBar User Data:', { user, role: this.userRole });
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }

  getProfileLink(): string {
    const link = this.userRole === 'bar' ? '/profile' : '/dashboard';
    console.log('Profile Link:', { role: this.userRole, link });
    return link;
  }

  navigateToProfile() {
    if (this.userRole === 'bar') {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
} 