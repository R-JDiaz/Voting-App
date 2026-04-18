import { Component } from '@angular/core';
import { ElList } from '../el-list/el-list';
import { ElBox } from '../el-box/el-box';
import { environment } from '@env/environments';

@Component({
  selector: 'app-el-container',
  imports: [ElList, ElBox],
  templateUrl: './el-container.html',
  styleUrl: './el-container.scss',
})
export class ElContainer {
  assetPath = environment.assetPath;
}
