import { Component } from '@angular/core';
import { ElDetailsBox } from '../el-details-box/el-details-box';
import { ElDetails2Box } from '../el-details2-box/el-details2-box';

@Component({
  selector: 'app-el-box',
  imports: [ElDetailsBox, ElDetails2Box],
  templateUrl: './el-box.html',
  styleUrl: './el-box.scss',
})
export class ElBox {}
