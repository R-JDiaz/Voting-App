import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { UserCard } from './user-card/user-card';
import { User } from '../../../../models/models';
import { AdminUserManagementFacade } from '../../../../services/facades/admin.user.management';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-list',
  imports: [UserCard, CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit{
  assetPath = environment.assetPath;

  constructor(public userFacade: AdminUserManagementFacade
  ) {}

  ngOnInit(): void {
    this.userFacade.loadUsers();
  }

  showUserSelected(user: User) {
    this.userFacade.selectUser(user);
    console.log('User selected:', user);
  }
} 
