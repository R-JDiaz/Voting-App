import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElectionService } from '../../services/election.service';
import { Election } from '../../models/models';

@Component({
  selector: 'app-create-election',
  templateUrl: './create-election.component.html',
  styleUrls: ['./create-election.component.css']
})
export class CreateElectionComponent {

  title = '';
  description = '';
  countdown = 3600;
  status = false ;

  submitting = false;
  error = '';
  success = '';

  constructor(
    private router: Router,
    private electionService: ElectionService
  ) {}

  createElection(): void {

    if (!this.title.trim()) {
      this.error = 'Election title is required';
      return;
    }

    const electionData: Partial<Election> = {
      title: this.title,
      description: this.description,
      countdown: this.countdown,
      status: this.status === true ? "active" : "pending"
    };

    this.submitting = true;
    this.error = '';

    this.electionService.createElection(electionData).subscribe({
      next: (response) => {

        if (response.success) {

          this.success = 'Election created successfully!';

          setTimeout(() => {
            this.router.navigate(['/admin/elections']);
          }, 1500);

        }

        this.submitting = false;

      },
      error: (error) => {

        this.error = error.error?.message || 'Failed to create election';
        this.submitting = false;

      }
    });

  }

}