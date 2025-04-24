import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VenueProfileComponent } from './components/venue-profile/venue-profile.component';
import { EventsComponent } from './components/events/events.component';
import { VenuesComponent } from './components/venues/venues.component';
import { HomeComponent } from './components/home/home.component';
import { VenueWizardComponent } from './components/venue-wizard/venue-wizard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'venues',
    component: VenuesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: VenueProfileComponent, 
    canActivate: [authGuard],
    data: { requiresVenueOwner: true }
  },
  {
    path: 'venue-wizard',
    component: VenueWizardComponent,
    canActivate: [authGuard],
    data: { requiresVenueOwner: true }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
