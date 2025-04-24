import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
    }, { 
      validators: [this.passwordMatchValidator] 
    });

    // Add validation for venue_detail when role is 'bar'
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const venueDetailControl = this.registerForm.get('venue_detail');
      if (role === 'bar') {
        venueDetailControl?.setValidators([Validators.required]);
      } else {
        venueDetailControl?.clearValidators();
      }
      venueDetailControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Show specific validation errors
      if (this.registerForm.hasError('passwordMismatch')) {
        this.errorMessage = 'Passwords do not match.';
      } else if (this.username?.errors?.['required']) {
        this.errorMessage = 'Username is required.';
      } else if (this.username?.errors?.['minlength']) {
        this.errorMessage = 'Username must be at least 3 characters long.';
      } else if (this.password?.errors?.['required']) {
        this.errorMessage = 'Password is required.';
      } else if (this.password?.errors?.['minlength']) {
        this.errorMessage = 'Password must be at least 6 characters long.';
      } else if (this.local_name?.errors?.['required']) {
        this.errorMessage = 'Full name is required.';
      } else if (this.local_email?.errors?.['required']) {
        this.errorMessage = 'Email is required.';
      } else if (this.local_email?.errors?.['email']) {
        this.errorMessage = 'Please enter a valid email address.';
      } else if (this.venue_detail?.errors?.['required']) {
        this.errorMessage = 'Venue name is required for venue owners.';
      }
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
      venue_detail: this.registerForm.get('role')?.value === 'bar' 
        ? this.registerForm.get('venue_detail')?.value 
        : null
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
