import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTimeService } from '@features/election/services/dateTime/date-time-service';
import { CountdownInterface } from '@shared/models/data';

@Component({
  selector: 'app-countdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown implements OnInit{
  countdown: CountdownInterface = {days: 0, hours: 0, minutes: 0, seconds: 0};

  constructor (private dateTimeService : DateTimeService) {}

  ngOnInit(): void {
    this.dateTimeService.countdown$.subscribe((count) => {
      if (count) { 
      this.countdown = count;
      }
    })
  }

}
