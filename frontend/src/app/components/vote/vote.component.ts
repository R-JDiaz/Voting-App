import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';

import { ElectionService } from '../../services/election.service';
import { VoteService } from '../../services/vote.service';
import { SocketService } from '../../services/socket.service';

interface Candidate {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name: string;
  candidates: Candidate[];
  selectedCandidateId?: number;
  collapsed?: boolean;
  voted?: boolean;
}

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit, OnDestroy {

  electionForm!: FormGroup;
  electionId!: number;
  positions: Position[] = [];

  loading = false;
  hasVoted = false;
  error: string | null = null;

  showResultsModal = false;
  voteResults: any[] = [];
  resultsHasVotes = false;

  electionStatus = 'pending';

  private socketSub!: Subscription;
  private electionUpdateSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private voteService: VoteService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.electionForm = this.fb.group({
      title: [''],
      description: [''],
      countdown: [0]
    });

    this.electionId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadElection();
    this.initSockets();
  }

  ngOnDestroy(): void {
    if (this.socketSub) this.socketSub.unsubscribe();
    if (this.electionUpdateSub) this.electionUpdateSub.unsubscribe();

    this.socketService.emit('leaveElection', this.electionId);
    this.socketService.disconnect();
  }

  private initSockets() {
    this.socketService.connect();
    this.socketService.emit('joinElection', this.electionId);

    // Countdown updates
    this.socketSub = this.socketService.listen<any>('countdownUpdate')
      .subscribe(data => {
        if (data.electionId === this.electionId) {
          this.electionForm.patchValue({ countdown: data.remaining });
          this.electionStatus = data.status;
        }
      });

    // Election ended
    this.socketService.listen<any>('electionEnded')
      .subscribe(data => {
        if (data.electionId === this.electionId) {
          this.voteResults = data.results || [];
          this.resultsHasVotes = data.hasVotes;
          this.showResultsModal = true;
        }
      });

    // Election updates (positions + candidates)
    this.electionUpdateSub = this.socketService.listen<any>('electionUpdate')
      .subscribe(data => {
        if (data.id === this.electionId) {
          this.patchElectionData(data);
        }
      });

    // Position updates
    this.socketService.onPositionUpdate().subscribe(data => {
      if (data.id === this.electionId) this.patchElectionData(data);
    });

    // Candidate updates
    this.socketService.onCandidateUpdate().subscribe(data => {
      if (data.id === this.electionId) this.patchElectionData(data);
    });
  }

  private patchElectionData(data: any) {
    this.electionForm.patchValue({
      title: data.title,
      description: data.description,
      countdown: data.remaining
    });
    this.electionStatus = data.status;

    this.positions = (data.positions || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      candidates: Array.isArray(p.candidates)
        ? p.candidates.map((c: any) => ({ id: c.id, name: c.name }))
        : [],
      collapsed: false,
      voted: false,
      selectedCandidateId: undefined
    }));
  }

  async loadElection() {
    try {
      const res: any = await firstValueFrom(this.electionService.getElectionById(this.electionId));
      const election = res.data;
      
      console.log(res.data);
      this.electionForm.patchValue({
        title: election.title,
        description: election.description,
        countdown: election.countdown
      });

      this.electionStatus = election.status;
      this.hasVoted = election.userHasVoted || false;
      
      // Ensure candidates are always an array of {id, name}
      console.log("ThiS IS CANDIDATES", election.positions);
      this.positions = (election.positions || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        candidates: Array.isArray(p.candidates)
          ? p.candidates.map((c: any) => ({ id: c.id, name: c.name }))
          : [],
        collapsed: false,
        voted: false,
        selectedCandidateId: undefined
      }));

    } catch (err) {
      this.error = 'Failed to load election';
    }
  }

  selectCandidate(position: Position, candidateId: number) {
    if (this.hasVoted) return;

    position.selectedCandidateId = candidateId;
    position.voted = true;
    position.collapsed = true;
  }

  async submitVotes() {
    if (this.hasVoted) return;

    const votes = this.positions
      .filter(p => p.selectedCandidateId)
      .map(p => p.selectedCandidateId!);

    if (votes.length === 0) {
      this.error = 'Please vote for at least one position';
      return;
    }

    try {
      this.loading = true;
      for (const candidateId of votes) {
        const res: any = await firstValueFrom(this.voteService.submitVote(candidateId));
        if (!res.success) throw new Error(res.message);
      }

      this.hasVoted = true;
      this.socketService.emit('userVoted', { electionId: this.electionId });

    } catch (err: any) {
      this.error = err.message || 'Voting failed';
    } finally {
      this.loading = false;
    }
  }

}