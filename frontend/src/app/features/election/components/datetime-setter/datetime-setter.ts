import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTimeService } from '@features/election/services/dateTime/date-time-service';

@Component({
  selector: 'app-datetime-setter',
  imports: [FormsModule],
  templateUrl: './datetime-setter.html',
  styleUrl: './datetime-setter.scss',
})
export class DatetimeSetter implements OnInit{

  startDateTime: string | null= null;
  endDateTime: string | null = null;

  constructor(public dateTimeService : DateTimeService) {}

  ngOnInit(): void {
    this.dateTimeService.dateTimeRange$.subscribe((time) => {
      if (!time) { return }
      this.startDateTime = time?.startDate;
      this.endDateTime = time?.endDate;
    })
  }

  onStartDateTimeChange(event: any): void {
    this.startDateTime = event.target.value;
  }

  onEndDateTimeChange(event: any): void {
    this.endDateTime = event.target.value;
  }


}