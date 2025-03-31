import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  role = '';
  barDetail = ''; // Only used if role is "bar"
  localName = '';
  localEmail = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    const userData = {
      username: this.username,
      password: this.password,
      role: this.role,
      barDetail: this.role === 'bar' ? this.barDetail : null,
      localName: this.localName,
      localEmail: this.localEmail
    };

    this.authService.register(userData).subscribe({
      next: data => {
        console.log('Registration successful', data);
        // Navigate to login page after successful registration.
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Registration error', err);
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}
