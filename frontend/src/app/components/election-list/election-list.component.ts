import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Election } from '../../models/models';

@Component({
  selector: 'app-election-list',
  templateUrl: './election-list.component.html',
  styleUrl: './election-list.component.css'
})
export class ElectionListComponent {
  @Input() selectedFilter!: string;
  @Input() activeElections: Election[] = [];
  @Input() upcomingElections: Election[] = [];
  @Input() endedElections: Election[] = [];
  @Input() isEmpty!: boolean;
  @Input() isAdmin!: boolean;
  @Output() viewElection = new EventEmitter<{ id: number; status: string }>();

  openElection(id: number, status: string) {
    this.viewElection.emit({
    id: id,
    status:status
  });
  }
}
