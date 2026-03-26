import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Election } from '../../models/models';

@Component({
  selector: 'app-election-card',
  templateUrl: './election-card.component.html',
  styleUrls: ['./election-card.component.css']
})
export class ElectionCardComponent {
  @Input() election!: Election;
  @Input() status!: 'active' | 'pending' | 'ended';
  @Input() showVoteButton = true;
  @Output() cardClick = new EventEmitter<{ id: number; status: string }>();

  onCardClick() {
    this.cardClick.emit({ id: this.election.id, status: this.election.status });
  }
}