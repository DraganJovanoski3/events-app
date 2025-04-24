import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      local_name: ['', [Validators.required]],
      local_email: ['', [Validators.required, Validators.email]],
      role: ['user', [Validators.required]],
      venue_detail: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      local_name: this.registerForm.get('local_name')?.value,
      local_email: this.registerForm.get('local_email')?.value,
      role: this.registerForm.get('role')?.value,
      venue_detail: this.registerForm.get('venue_detail')?.value
    };

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 400) {
          this.errorMessage = 'Username or email already exists.';
        } else if (error.status === 422) {
          this.errorMessage = 'Please check your input and try again.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
  }

  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get local_name() { return this.registerForm.get('local_name'); }
  get local_email() { return this.registerForm.get('local_email'); }
  get role() { return this.registerForm.get('role'); }
  get venue_detail() { return this.registerForm.get('venue_detail'); }
}
