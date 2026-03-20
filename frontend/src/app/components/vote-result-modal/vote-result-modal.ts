
import { Component, Input, OnInit } from '@angular/core';

interface CandidateResult {
  candidate_name: string;
  votes_count?: number;
}

export interface PositionResult {
  position_name: string;
  candidates: CandidateResult[];
}

@Component({
  selector: 'app-vote-result-modal',
  templateUrl: './vote-result-modal.html',
  styleUrls: ['./vote-result-modal.css']
})
export class VoteResultModalComponent implements OnInit {
  @Input() show = false;
  @Input() results: PositionResult[] = [];
  @Input() hasVotes = false;

  constructor() {}

  ngOnInit(): void {}
}