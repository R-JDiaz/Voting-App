import { Component } from '@angular/core';
import { environment } from '../../../../../../environments/environments';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  assetPath = environment.assetPath;
}
