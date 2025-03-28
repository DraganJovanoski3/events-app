import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLocalOwner: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      localName: [''], // Only required for local owners
      localEmail: [''] // Only required for local owners
    });

    // Watch for role changes to toggle extra fields
    this.registerForm.get('role')?.valueChanges.subscribe(value => {
      this.isLocalOwner = (value === 'local owner');
      if (this.isLocalOwner) {
        this.registerForm.get('localName')?.setValidators(Validators.required);
        this.registerForm.get('localEmail')?.setValidators([Validators.required, Validators.email]);
      } else {
        this.registerForm.get('localName')?.clearValidators();
        this.registerForm.get('localEmail')?.clearValidators();
      }
      this.registerForm.get('localName')?.updateValueAndValidity();
      this.registerForm.get('localEmail')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(response => {
        // handle successful registration (maybe navigate to login)
        this.router.navigate(['/login']);
      });
    }
  }
}
