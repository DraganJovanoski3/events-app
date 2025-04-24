import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    AppComponent
  ],
  providers: []
})
export class AppModule { } 