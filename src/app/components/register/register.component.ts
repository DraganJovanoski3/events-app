import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  local_name = '';
  local_email = '';
  role = 'user';
  venue_detail = '';
  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Reset error message
    this.error = '';

    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    // Validate all required fields
    if (!this.username.trim()) {
      this.error = 'Username is required';
      return;
    }
    if (!this.password.trim()) {
      this.error = 'Password is required';
      return;
    }
    if (!this.local_name.trim()) {
      this.error = 'Name is required';
      return;
    }
    if (!this.local_email.trim()) {
      this.error = 'Email is required';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.local_email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    // Validate password strength
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;

    const userData = {
      username: this.username.trim(),
      password: this.password,
      role: this.role,
      local_name: this.local_name.trim(),
      local_email: this.local_email.trim(),
      venue_detail: this.role === 'bar' ? this.venue_detail : undefined
    };

    this.authService.register(userData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
  }
}
