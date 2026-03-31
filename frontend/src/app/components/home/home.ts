import { Component } from '@angular/core';
import { ElContainer } from '../elections/el-container/el-container';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [ElContainer, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
