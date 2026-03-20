import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ElectionService } from '../../services/election.service';
import { Election } from '../../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  elections: Election[] = [];
  loading = true;
  error = '';
  currentUser: any;
  selectedFilter: 'all' | 'active' | 'pending' | 'ended' = 'all';

  constructor(
    private authService: AuthService,
    private electionService: ElectionService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.loading = true;

    this.electionService.getAllElections()
      .subscribe({
        next: (response) => {

          if (response.success) {
            console.log(response);
            this.elections = response.data.map((e: Election) => ({
              ...e,
              status: e.status
            }));

          }

          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load elections';
          this.loading = false;
        }
      });
  }

   setFilter(filter: 'all' | 'active' | 'pending' | 'ended', event: Event): void {
    event.preventDefault();
    this.selectedFilter = filter;
  }

  get isEmpty(): boolean {
    if (this.selectedFilter === 'active') return this.activeElections.length === 0;
    if (this.selectedFilter === 'pending') return this.upcomingElections.length === 0;
    if (this.selectedFilter === 'ended') return this.endedElections.length === 0;
    return this.elections.length === 0; // for "all"
  }

  get activeElections(): Election[] {
    return this.elections.filter(
      e => e.status == "active" && Number(e.countdown) > 0
    );
  }

  get upcomingElections(): Election[] {
    return this.elections.filter(
      e => e.status == "pending"
    );
  }

  get endedElections(): Election[] {
    return this.elections.filter(
      e => e.status == "ended"
    );
  }

 viewElection(event: { id: number; status: string }): void {
    if (!this.currentUser) return;

    const { id, status } = event;

    if (this.currentUser.role === 'admin') {
      this.router.navigate(['/admin/election', id]);
    } else if (status === 'ended') {
      this.router.navigate(['/election/results/', id]);
    } else {
      this.router.navigate(['/elections/vote', id]);
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
}
