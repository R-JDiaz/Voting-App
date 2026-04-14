import { Component } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { UserList } from './user-list/user-list';
import { Navbar } from '../../navbar/navbar';
import { UserBox } from './user-box/user-box';

@Component({
  selector: 'app-admin-menu',
  imports: [UserList, Navbar, UserBox],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class AdminMenu {
}
