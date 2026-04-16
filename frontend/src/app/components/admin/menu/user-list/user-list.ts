import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { UserCard } from './user-card/user-card';
import { User } from '../../../../models/models';

@Component({
  selector: 'app-user-list',
  imports: [UserCard],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  assetPath = environment.assetPath;
  user: User | null = null;


  
}
