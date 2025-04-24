import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService, UserData } from '../../services/auth.service';
import { EventService, Event } from '../../services/event.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-venue-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './venue-events.component.html',
  styleUrls: ['./venue-events.component.scss']
})
export class VenueEventsComponent implements OnInit {
  events: Event[] = [];
  showCreateForm = false;
  editingEvent: Event | null = null;
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      hasTickets: [false],
      price: [0, [Validators.min(0)]],
      capacity: [0, [Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.authService.currentUser$.pipe(take(1)).subscribe((user: UserData | null) => {
      const venueId = user?.bar_detail ? parseInt(user.bar_detail) : null;
      if (venueId) {
        this.eventService.getEventsByVenue(venueId).subscribe({
          next: (events: Event[]) => {
            this.events = events;
          },
          error: (error: any) => {
            this.snackBar.open('Error loading events', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openCreateEventForm() {
    this.editingEvent = null;
    this.eventForm.reset();
    this.showCreateForm = true;
  }

  editEvent(event: Event) {
    this.editingEvent = event;
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      startTime: event.startTime,
      endTime: event.endTime,
      hasTickets: event.hasTickets,
      price: event.price,
      capacity: event.capacity
    });
    this.showCreateForm = true;
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      this.authService.currentUser$.pipe(take(1)).subscribe((user: UserData | null) => {
        const venueId = user?.bar_detail ? parseInt(user.bar_detail) : null;
        if (venueId) {
          if (this.editingEvent) {
            this.eventService.updateEvent(this.editingEvent.id, { ...formData, venueId }).subscribe({
              next: () => {
                this.snackBar.open('Event updated successfully', 'Close', { duration: 3000 });
                this.loadEvents();
                this.cancelForm();
              },
              error: (error: any) => {
                this.snackBar.open('Error updating event', 'Close', { duration: 3000 });
              }
            });
          } else {
            this.eventService.createEvent({ ...formData, venueId }).subscribe({
              next: () => {
                this.snackBar.open('Event created successfully', 'Close', { duration: 3000 });
                this.loadEvents();
                this.cancelForm();
              },
              error: (error: any) => {
                this.snackBar.open('Error creating event', 'Close', { duration: 3000 });
              }
            });
          }
        }
      });
    }
  }

  deleteEvent(eventId: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
          this.loadEvents();
        },
        error: (error: any) => {
          this.snackBar.open('Error deleting event', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancelForm() {
    this.showCreateForm = false;
    this.editingEvent = null;
    this.eventForm.reset();
  }
} 