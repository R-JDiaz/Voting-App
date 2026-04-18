import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '@env/environments';
import { PublicElection } from '@shared/models/models';

@Component({
  selector: 'app-el-card',
  imports: [],
  templateUrl: './el-card.html',
  styleUrl: './el-card.scss',
})
export class ElCard {
  assetPath = environment.assetPath;

  @Input() election : PublicElection | null = null;
  
  @Output() selectedElection = new EventEmitter<number>;

  onSelectElection() {
    if (this.election) {
      this.selectedElection.emit(this.election.id);
    }
  }
}
