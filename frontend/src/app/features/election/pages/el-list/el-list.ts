import { Component } from '@angular/core';
import { environment } from '@env/environments';
import { ElCard } from '@features/election/components/el-card/el-card';

@Component({
  selector: 'app-el-list',
  imports: [ElCard],
  templateUrl: './el-list.html',
  styleUrl: './el-list.scss',
})
export class ElList {
  assetPath = environment.assetPath;
}
