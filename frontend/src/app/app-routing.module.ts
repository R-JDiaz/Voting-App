import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { VoteComponent } from './components/vote/vote.component';
import { ViewElectionComponent } from './components/view-election/view-election.component';
import { AdminElectionComponent } from './components/admin-election/admin-election.component';
import { CreateElectionComponent } from './components/create-election/create-election.component';
import { VoteResultComponent } from './components/vote-result/vote-result';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin/elections/create', component: CreateElectionComponent, canActivate: [AuthGuard] },
  { path: 'elections/vote/:id', component: VoteComponent},
  { path: 'election/:id', component: ViewElectionComponent },
  { path: 'admin/election/:id', component: AdminElectionComponent },
  { path: 'election/results/:id', component: VoteResultComponent},
  { path: 'admin/dashboard', component: AdminDashboardComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
