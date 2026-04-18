import { Component } from '@angular/core';
import { Navbar } from '@features/layouts/navbar/navbar';
import { UserBox } from '@features/user/components/user-box/user-box';
import { UserList } from '@features/user/components/user-list/user-list';

@Component({
  selector: 'app-admin-menu',
  imports: [UserList, Navbar, UserBox],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class AdminMenu {
}
