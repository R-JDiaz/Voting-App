import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  assetPath = environment.assetPath;
}
