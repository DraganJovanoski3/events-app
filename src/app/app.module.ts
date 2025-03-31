import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Make sure to add DashboardComponent
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EventListComponent,
    AddEventComponent,
    EventDetailComponent,
    SearchBarComponent,
    DashboardComponent,
    HomeComponent,
    NavbarComponent  
  ],
  imports: [
    BrowserModule,           // Provides CommonModule as well
    ReactiveFormsModule,     // For reactive forms
    HttpClientModule,        // For HTTP services
    AppRoutingModule,        // Your routing module
    FormsModule              // Needed for ngModel and template-driven forms
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
