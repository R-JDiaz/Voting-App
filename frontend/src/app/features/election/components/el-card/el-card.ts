import { Component } from '@angular/core';
import { environment } from '@env/environments';

@Component({
  selector: 'app-el-card',
  imports: [],
  templateUrl: './el-card.html',
  styleUrl: './el-card.scss',
})
export class ElCard {
  assetPath = environment.assetPath;
}
