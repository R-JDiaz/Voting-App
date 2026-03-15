import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface DashboardItem {
  title: string;
  description: string;
  buttonText: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username: string = '';

  dashboardItems: DashboardItem[] = [
    {
      title: 'Vote',
      description: 'Cast your vote for your preferred candidate.',
      buttonText: 'Vote Now',
      route: '/vote'
    },
    {
      title: 'View Candidates',
      description: 'See the list of candidates.',
      buttonText: 'View',
      route: '/candidates'
    },
    {
      title: 'View Results',
      description: 'Check election results.',
      buttonText: 'Results',
      route: '/results'
    },
    {
      title: 'Candidate Management',
      description: 'Add or remove candidates.',
      buttonText: 'Manage',
      route: '/admin-management'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const voter = localStorage.getItem('voter');
    if (voter) {
      this.username = voter;
    }
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    localStorage.removeItem('voter');
    this.router.navigate(['/login']);
  }

}
//dashboard.component.html
<div class="dashboard-container">

  <h1>Welcome {{username}}</h1>
  <h2>Voting System Dashboard</h2>

  <div class="dashboard-grid">

    <div class="card" *ngFor="let item of dashboardItems">

      <h3>{{item.title}}</h3>
      <p>{{item.description}}</p>

      <button (click)="navigate(item.route)">
        {{item.buttonText}}
      </button>

    </div>

  </div>

  <button class="logout" (click)="logout()">
    Logout
  </button>

</div>
//dashboard.component.css

.dashboard-container{
    text-align:center;
    padding:40px;
}

.dashboard-grid{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:25px;
    margin-top:40px;
}

.card{
    border:1px solid #ddd;
    padding:25px;
    width:240px;
    border-radius:12px;
    box-shadow:0 4px 10px rgba(0,0,0,0.1);
}

button{
    padding:10px 18px;
    margin-top:12px;
    border:none;
    background:#4CAF50;
    color:white;
    border-radius:5px;
    cursor:pointer;
}

button:hover{
    background:#388e3c;
}

.logout{
    margin-top:40px;
    background:#e53935;
}

.logout:hover{
    background:#c62828;
      }
//Sa app-routing.module.ts

import { DashboardComponent } from './dashboard/dashboard.component';

{ path: 'dashboard', component: DashboardComponent }

//palitan mo to sa app.component ito ipalit mo pre

this.router.navigate(['/dashboard']);
