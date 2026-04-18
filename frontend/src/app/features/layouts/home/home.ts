import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ElContainer } from '@features/election/pages/el-container/el-container';

@Component({
  selector: 'app-home',
  imports: [ElContainer, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
