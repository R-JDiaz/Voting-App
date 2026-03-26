import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../services/vote.service';
import { ActivatedRoute } from '@angular/router';

interface CandidateResult {
  candidate_id: number;
  candidate_name: string;
  vote_count: number;
  vote_percentage: number;
}

export interface PositionResult {
  position_id: number;
  position_name: string;
  total_votes: number;
  total_candidates: number;
  candidates: CandidateResult[];
}

@Component({
  selector: 'app-vote-result',
  templateUrl: './vote-result.html',
  styleUrls: ['./vote-result.css']
})
export class VoteResultComponent implements OnInit {
  show = true;
  electionId!: number;

  results: PositionResult[] = [];
  totalVotes = 0;
  hasVotes = false;

  constructor(private voteService: VoteService,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.electionId) {
      this.loadResults();
    }
  }

  loadResults(): void {
    this.voteService.getElectionResults(this.electionId).subscribe({
      next: (res) => {
        this.results = res.data.results;

        // ✅ total votes (sum of all positions)
        this.totalVotes = this.results.reduce(
          (sum, pos) => sum + pos.total_votes,
          0
        );

        this.hasVotes = this.totalVotes > 0;
      },
      error: (err) => console.error(err)
    });
  }

  close() {
    this.show = false;
  }
}