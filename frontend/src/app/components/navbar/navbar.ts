import { Component } from '@angular/core';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  assetPath = environment.assetPath;
}
