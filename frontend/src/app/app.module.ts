import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VoteComponent } from './components/vote/vote.component';
import { AdminElectionComponent } from './components/admin-election/admin-election.component';
import { ViewElectionComponent } from './components/view-election/view-election.component';
import { CreateElectionComponent } from './components/create-election/create-election.component';
import { VoteResultModalComponent } from './components/vote-result-modal/vote-result-modal';
import { ElectionCardComponent } from './components/election-card/election-card.component';
import { ElectionListComponent } from './components/election-list/election-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    CreateElectionComponent,
    AdminElectionComponent,
    ViewElectionComponent,
    VoteComponent,
    VoteResultModalComponent,
    ElectionCardComponent,
    ElectionListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
