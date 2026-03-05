import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html'
})
export class VoteComponent {

  candidates = ['Candidate A', 'Candidate B', 'Candidate C'];
  selectedCandidate = '';

  constructor(private router: Router) {}

  submitVote() {
    if (this.selectedCandidate) {
      localStorage.setItem('vote', this.selectedCandidate);
      this.router.navigate(['/results']);
    }
  }
}
