
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElectionService } from '../../services/election.service';
import { PositionService } from '../../services/position.service';
import { CandidateService } from '../../services/candidate.service';
import { VoteService } from '../../services/vote.service';
import { Election, Position, Candidate } from '../../models/models';

@Component({
  selector: 'app-view-election',
  templateUrl: './view-election.component.html',
  styleUrls: ['./view-election.component.css']
})
export class ViewElectionComponent implements OnInit, OnDestroy {

  electionId!: number;
  election: Election | null = null;

  positions: Position[] = [];
  candidatesMap: { [positionId: number]: Candidate[] } = {};

  countdownSeconds: number = 0;
  intervalId: ReturnType<typeof setInterval> | null = null;

  loading = true;
  error: string | null = null;

  votedPositions: { [positionId: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private positionService: PositionService,
    private candidateService: CandidateService,
    private voteService: VoteService
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadElection();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /* -------------------------
     LOAD ELECTION
  --------------------------*/

  loadElection(): void {
    this.loading = true;

    this.electionService.getElectionById(this.electionId).subscribe({
      next: (res) => {

        if (res.success && res.data) {

          this.election = res.data;

          this.countdownSeconds = this.election.countdown ?? 0;

          this.startCountdown();

          this.loadPositions();

        } else {

          this.error = res.message || 'Failed to load election';

        }

        this.loading = false;

      },
      error: () => {

        this.error = 'Server error';

        this.loading = false;

      }
    });
  }

  /* -------------------------
     LOAD POSITIONS
  --------------------------*/

  loadPositions(): void {

    if (!this.electionId) return;

    this.positionService.getPositionsByElection(this.electionId).subscribe({
      next: (res) => {

        if (res.success && res.data) {

          this.positions = res.data;

          this.positions.forEach(pos => {
            this.loadCandidates(pos.id);
          });

        }

      },
      error: () => {

        this.error = 'Failed to load positions';

      }
    });
  }

  /* -------------------------
     LOAD CANDIDATES
  --------------------------*/

  loadCandidates(positionId: number): void {

    this.candidateService.getCandidatesByPosition(positionId).subscribe({
      next: (res) => {

        if (res.success && res.data) {

          this.candidatesMap[positionId] = res.data;

        }

      },
      error: () => {

        this.error = 'Failed to load candidates';

      }
    });
  }

  /* -------------------------
     COUNTDOWN TIMER
  --------------------------*/

  startCountdown(): void {

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {

      if (this.countdownSeconds > 0) {

        this.countdownSeconds--;

      } else {

        if (this.intervalId) {
          clearInterval(this.intervalId);
        }

      }

    }, 1000);
  }

  /* -------------------------
     FORMAT TIME
  --------------------------*/

  formatTime(seconds: number): string {

    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');

    return `${h}:${m}:${s}`;
  }

  /* -------------------------
     SUBMIT VOTE
  --------------------------*/

  vote(candidateId: number, positionId: number): void {

    if (this.votedPositions[positionId]) return;

    this.voteService.submitVote(candidateId).subscribe({
      next: (res) => {

        if (res.success) {

          this.votedPositions[positionId] = true;

        } else {

          alert(res.message || 'Vote failed');

        }

      },
      error: () => {

        alert('Server error while voting');

      }
    });
  }

}
