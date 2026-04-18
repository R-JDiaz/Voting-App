import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { create } from 'domain';
import { PublicElection, PublicFullElection } from '@shared/models/models';
import { ElectionService } from '@core/apis/election';

@Injectable({
  providedIn: 'root',
})
export class ElectionManagement {
    private loaded = false;

    private readonly electionSubject = new BehaviorSubject<PublicElection[]>([]);
    readonly elections$ = this.electionSubject.asObservable();

    private readonly selectedElectionSubject = new BehaviorSubject<PublicFullElection | null>(null);
    readonly selectedElection$ = this.selectedElectionSubject.asObservable();

    constructor(private electionService : ElectionService) {};

    loadElections() {
        if (this.loaded) { return }
        this.electionService.getAll().subscribe((elections) => {
            this.electionSubject.next(elections);
            this.loaded = true;
        })
    }

    selectElection(id : number) {
        this.electionService.getFullById(id).subscribe((election) => {
            this.selectedElectionSubject.next(election);
        })
    }

    createElection(election : PublicElection) {
        this.electionService.create(election).subscribe((created) => {
            const current = this.electionSubject.value;
            this.electionSubject.next([...current, created])
        })
    }
}
