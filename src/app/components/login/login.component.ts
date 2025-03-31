import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // Call the AuthService login method.
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: data => {
          console.log('Login successful', data);
          // Store the token in localStorage.
          localStorage.setItem('token', data.token);
          // Navigate to a protected route (e.g., dashboard).
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          console.error('Login error', err);
          this.errorMessage = err.error.message || 'Invalid credentials. Please try again.';
        }
      });
  }
}
