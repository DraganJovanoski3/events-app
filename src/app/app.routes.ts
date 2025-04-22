import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { VenueWizardComponent } from './components/venue-wizard/venue-wizard.component';
import { VenueProfileComponent } from './components/venue-profile/venue-profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'add-event', 
    component: AddEventComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'venue-wizard', 
    component: VenueWizardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    component: VenueProfileComponent,
    canActivate: [authGuard],
    data: { requiresVenueOwner: true }
  },
  { path: '**', redirectTo: '' }
];
