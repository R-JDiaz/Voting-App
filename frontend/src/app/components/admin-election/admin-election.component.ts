import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ElectionService } from '../../services/election.service';
import { PositionService } from '../../services/position.service';
import { CandidateService } from '../../services/candidate.service';
import { Election, Position, Candidate } from '../../models/models';
import { firstValueFrom } from 'rxjs';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-admin-election',
  templateUrl: './admin-election.component.html',
  styleUrls: ['./admin-election.component.css']
})
export class AdminElectionComponent implements OnInit {

  electionId!: number;
  electionForm: FormGroup;
  loading = false;
  error: string | null = null;
  totalVotes: number = 0;
  electionDetails: { id: number; title: string; status: string } | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private electionService: ElectionService,
    private positionService: PositionService,
    private candidateService: CandidateService,
    private socketService: SocketService,
    private viewContainerRef: ViewContainerRef
  ) {
    this.electionForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      countdown: [3600, Validators.required],
      status: ['pending', Validators.required],
      positions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadElection();

      // Join the election room for real-time updates
    this.socketService.joinElectionRoom(this.electionId);

    // Listen for candidate vote updates
    this.socketService.listen<{ totalVotes: number }>('voteUpdate')
      .subscribe(update => {
        this.totalVotes = update.totalVotes;
      });
  }

  // ------------------------
  // POSITIONS
  // ------------------------
  get positions(): FormArray {
    return this.electionForm.get('positions') as FormArray;
  }

  addPosition(name = '', description = '', id: number | null = null): void {
    const position = this.fb.group({
      id: [id],
      name: [name, Validators.required],
      description: [description],
      candidates: this.fb.array([])
    });
    this.positions.push(position);
  }

  removePosition(index: number): void {
    const posId = this.positions.at(index).get('id')?.value;
    if (posId) {
      this.positionService.deletePosition(posId).subscribe();
    }
    this.positions.removeAt(index);
  }

  // ------------------------
  // CANDIDATES
  // ------------------------
  candidates(positionIndex: number): FormArray {
    return this.positions.at(positionIndex).get('candidates') as FormArray;
  }

  addCandidate(positionIndex: number, name = '', id: number | null = null): void {
    const candidate = this.fb.group({
      id: [id],
      name: [name, Validators.required]
    });
    this.candidates(positionIndex).push(candidate);
  }

  removeCandidate(positionIndex: number, candidateIndex: number): void {
    const candId = this.candidates(positionIndex).at(candidateIndex).get('id')?.value;
    if (candId) {
      this.candidateService.deleteCandidate(candId).subscribe();
    }
    this.candidates(positionIndex).removeAt(candidateIndex);
  }

  deleteElection(): void {
  this.electionService.deleteElection(this.electionId).subscribe({
    next: res => {
      if (res.success) {
        console.log(`Election ${this.electionId} deleted successfully`);
        this.closeModal();
      } else {
        this.error = res.message || 'Failed to delete election';
      }
    },
    error: err => {
      this.error = err.message || 'Server error while deleting election';
    }
  });
}
  // Check for duplicate position names or candidate names
hasDuplicates(): boolean {
  const posNames = new Set<string>();
  const candNames = new Set<string>();

  for (let i = 0; i < this.positions.length; i++) {
    const posCtrl = this.positions.at(i);
    const posName = posCtrl.value.name.trim().toLowerCase();

    if (posNames.has(posName)) {
      this.error = `Duplicate position name: "${posCtrl.value.name}"`;
      return true;
    }
    posNames.add(posName);

    const candidates = posCtrl.get('candidates') as FormArray;
    for (let j = 0; j < candidates.length; j++) {
      const candName = candidates.at(j).value.name.trim().toLowerCase();
      if (candNames.has(candName)) {
        this.error = `Duplicate candidate name: "${candidates.at(j).value.name}"`;
        return true;
      }
      candNames.add(candName);
    }
  }

  // No duplicates found
  return false;
}
  // ------------------------
  // Load election + positions + candidates
  // ------------------------
async loadElection(): Promise<void> {
  this.loading = true;
  try {
    const res = await firstValueFrom(this.electionService.getElectionById(this.electionId));
    if (!res.success || !res.data) throw new Error(res.message || 'Failed to load election');

    const election = res.data;
    this.electionForm.patchValue({
      title: election.title,
      description: election.description,
      countdown: election.countdown,
      status: election.status
    });

    // Store election details for display
    this.electionDetails = {
      id: election.id,
      title: election.title,
      status: election.status
    };
      console.log(res.data);
      const posRes = await firstValueFrom(this.positionService.getPositionsByElection(this.electionId));
      if (posRes.success && posRes.data) {
        for (const pos of posRes.data) {
          this.addPosition(pos.name, pos.description || '', pos.id);

          const idx = this.positions.length - 1;
          const candRes = await firstValueFrom(this.candidateService.getCandidatesByPosition(pos.id));
          if (candRes.success && candRes.data) {
            const candidateFGs = candRes.data.map(cand => this.fb.group({ id: [cand.id], name: [cand.name, Validators.required] }));
            const candArr = this.positions.at(idx).get('candidates') as FormArray;
            candArr.clear();  
          candidateFGs.forEach(fg => candArr.push(fg));
          }
        }
      }

    } catch (err: any) {
      this.error = err.message || 'Server error';
    } finally {
      this.loading = false;
    }
  }

  // ------------------------
  // Submit updates
  // ------------------------
  async submit(): Promise<void> {
    if (this.electionForm.invalid) {
      this.error = 'Please fill required fields';
      return;
    }
    if (this.hasDuplicates()) {
    return; // Stop submission if duplicates found
    } 
    this.loading = true;
    this.error = null;

    try {
      const electionData: Partial<Election> = {
        title: this.electionForm.value.title,
        description: this.electionForm.value.description,
        countdown: this.electionForm.value.countdown,
        status: this.electionForm.value.status
      };
      
      const res = await firstValueFrom(this.electionService.updateElection(this.electionId, electionData));
      if (!res.success) throw new Error(res.message || 'Failed to update election');

      // ✅ Update/create positions
      for (let i = 0; i < this.positions.length; i++) {
        const posCtrl = this.positions.at(i);
        const posData = {
          name: posCtrl.value.name,
          description: posCtrl.value.description
        };
        let posId = posCtrl.get('id')?.value;

        if (posId) {
          const posRes = await firstValueFrom(this.positionService.updatePosition(posId, posData));
          if (!posRes.success) throw new Error(`Failed to update position: ${posData.name}`);
        } else {
          const posRes = await firstValueFrom(this.positionService.createPosition(this.electionId, posData));
          if (!posRes.success || !posRes.data?.id) throw new Error(`Failed to create position: ${posData.name}`);
          posId = posRes.data.id;
          posCtrl.get('id')?.setValue(posId);
        }

        // ✅ Update/create candidates
        const candArr = posCtrl.get('candidates') as FormArray;
        for (let j = 0; j < candArr.length; j++) {
          const candCtrl = candArr.at(j);
          const candData = { name: candCtrl.value.name };
          const candId = candCtrl.get('id')?.value;

          if (candId) {
            const candRes = await firstValueFrom(this.candidateService.updateCandidate(candId, candData));
            if (!candRes.success) throw new Error(`Failed to update candidate: ${candData.name}`);
          } else {
            const candRes = await firstValueFrom(this.candidateService.createCandidate(posId, candData));
            if (!candRes.success || !candRes.data?.id) throw new Error(`Failed to create candidate: ${candData.name}`);
            candCtrl.get('id')?.setValue(candRes.data.id);
          }
        }
      }

      this.router.navigate(['/admin/elections']);

    } catch (err: any) {
      this.error = err.message || 'Server error';
    } finally {
      this.loading = false;
    }
  }
  closeModal(): void {
  this.router.navigate(['/admin']); // Navigate back to your home/admin list page
}

  updateVoteCount(update: { candidateId: number, votes: number }) {
  for (let i = 0; i < this.positions.length; i++) {
    const candArr = this.candidates(i);
    for (let j = 0; j < candArr.length; j++) {
      const candCtrl = candArr.at(j) as FormGroup; // <-- cast here
      if (candCtrl.get('id')?.value === update.candidateId) {
        // Add a 'votes' control if it doesn't exist
        if (!candCtrl.get('votes')) {
          candCtrl.addControl('votes', this.fb.control(update.votes)); // now works
        } else {
          candCtrl.get('votes')?.setValue(update.votes);
        }
      }
    }
  }
}
  showResults(): void {
    // Dynamically create the VoteResultComponent modal
         this.router.navigate(['/election/results/', this.electionId]);
    };
  }