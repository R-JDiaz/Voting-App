import { Component, OnInit } from '@angular/core';
import { User } from '@shared/models/models';
import { AdminUserManagementFacade } from '@shared/services/facades/admin.user.management';

@Component({
  selector: 'app-user-box',
  imports: [],
  templateUrl: './user-box.html',
  styleUrl: './user-box.scss',
})
export class UserBox implements OnInit {
  user: User | null = null;

  constructor ( private userFacade: AdminUserManagementFacade ) {}

  ngOnInit(): void {
    this.userFacade.selectedUser$.subscribe(user => {
      this.user = user;
    });
  }


  onTogglePermission(isChecked: boolean) {
    this.user!.can_create_election = isChecked;
    console.log('Permission toggled:', this.user?.can_create_election);
  }

  updatePermissions() {
    this.userFacade.updateuserCCEPermission(this.user!, this.user!.can_create_election);
    console.log('Permissions updated for user:', this.user);
  }
}
