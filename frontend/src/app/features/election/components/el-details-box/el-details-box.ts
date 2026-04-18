import { Component, OnInit } from '@angular/core';
import { Countdown } from '../countdown/countdown';
import { DatetimeSetter } from '../datetime-setter/datetime-setter';
import { environment } from '@env/environments';
import { ElectionManagement } from '@shared/services/facades/election.management';
import { PublicFullElection } from '@shared/models/models';
import { CommonModule } from '@angular/common';
import { CountdownInterface } from '@shared/models/data';
import { DateTimeService } from '@features/election/services/dateTime/date-time-service';

@Component({
  selector: 'app-el-details-box',
  imports: [
    Countdown,
    DatetimeSetter,
    CommonModule
  ],
  templateUrl: './el-details-box.html',
  styleUrl: './el-details-box.scss',
})

export class ElDetailsBox implements OnInit{
    assetPath = environment.assetPath;

    election : PublicFullElection | null = null;

    countdown: CountdownInterface = {days: 0, hours: 0, minutes: 0, seconds: 0};
    
    constructor (
      public electionFacade: ElectionManagement, 
      public dateTimeService: DateTimeService
    ) {}

    ngOnInit(): void {
      this.electionFacade.selectedElection$.subscribe((election) => {
        this.election = election;
        this.dateTimeService.setDateRange(
          this.election?.startDate, 
          this.election?.endDate);
      })
    }
}
