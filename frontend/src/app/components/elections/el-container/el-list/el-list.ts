import { Component } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { ElCard } from '../el-card/el-card';

@Component({
  selector: 'app-el-list',
  imports: [ElCard],
  templateUrl: './el-list.html',
  styleUrl: './el-list.scss',
})
export class ElList {
  assetPath = environment.assetPath;
}
