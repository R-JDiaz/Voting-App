import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environments';
import { ElCard } from '@features/election/components/el-card/el-card';
import { PublicElection } from '@shared/models/models';
import { ElectionManagement } from '@shared/services/facades/election.management';
import { ECDH } from 'crypto';

@Component({
  selector: 'app-el-list',
  imports: [ElCard, CommonModule],
  templateUrl: './el-list.html',
  styleUrl: './el-list.scss',
})
export class ElList implements OnInit{
  assetPath = environment.assetPath;

  constructor(public electionFacade: ElectionManagement) {}

  ngOnInit(): void {
    this.electionFacade.loadElections();
  }

  displaySelectedElection(id : number) {
    this.electionFacade.selectElection(id);
  }
}
