import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Election } from '../../models/models';

@Component({
  selector: 'app-election-card',
  templateUrl: './election-card.component.html',
  styleUrl: './election-card.component.css'
})
export class ElectionCardComponent {
  @Input() election!: Election;
  @Input() status!: 'active' | 'pending' | 'ended';
  @Input() showVoteButton = true;
  @Output() cardClick = new EventEmitter<number>();

onCardClick() {
  this.cardClick.emit(this.election.id);
}

}
