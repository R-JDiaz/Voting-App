import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environments';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  assetPath = environment.assetPath;
}
