import { Component } from '@angular/core';
import { User } from '../../../../models/models';

@Component({
  selector: 'app-user-box',
  imports: [],
  templateUrl: './user-box.html',
  styleUrl: './user-box.scss',
})
export class UserBox {
  user: User = {
    id: 0,
    username: 'Sample User',
    email: 'sample@example.com',
    role: 'user',
    can_create_election: true
  };

  constructor() {
    // Mock user data for demonstration
  }

  onTogglePermission(isChecked: boolean) {
    this.user.can_create_election = isChecked;
    console.log('Permission toggled:', this.user.can_create_election);
  }

  updatePermissions() {
    // Handle saving updated permissions here
    console.log('Permissions updated for user:', this.user);
  }

}
