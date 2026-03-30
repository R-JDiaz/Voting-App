import { Component } from '@angular/core';
import { ElList } from '../el-list/el-list';
import { ElDetailsBox } from '../el-details-box/el-details-box';

@Component({
  selector: 'app-el-container',
  imports: [ElList, ElDetailsBox],
  templateUrl: './el-container.html',
  styleUrl: './el-container.scss',
})
export class ElContainer {}
