import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { User } from '../../../../../models/models';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  assetPath = environment.assetPath;
  @Input() user: User | null = null;

  @Output() userSelected = new EventEmitter<User>();

  onSelectUser() {
    if (this.user) {
      this.userSelected.emit(this.user);
    }
  }
}
