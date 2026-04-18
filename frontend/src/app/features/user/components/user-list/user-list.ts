import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@env/environments';
import { AdminUserManagementFacade } from '@shared/services/facades/admin.user.management';
import { User } from '@shared/models/models';
import { UserCard } from '../user-card/user-card';
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
