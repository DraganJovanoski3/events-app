import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../services/auth-state.service';
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

  constructor(
    private authService: AuthService,
    private authState: AuthStateService,
    private router: Router
  ) {}

  onLogin() {
    // Call the AuthService login method.
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: data => {
          console.log('Login successful', data);
          // Update auth state
          this.authState.setLoggedIn({
            token: data.token,
            username: this.username,
            role: data.role || 'user'
          });
          // Navigate to home page after successful login.
          this.router.navigate(['/home']);
        },
        error: err => {
          console.error('Login error', err);
          this.errorMessage = err.error.message || 'Invalid credentials. Please try again.';
        }
      });
  }
}
