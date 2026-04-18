import { Component } from '@angular/core';
import { environment } from '@env/environments';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  assetPath = environment.assetPath;
}
