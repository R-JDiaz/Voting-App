import { Component } from '@angular/core';
import { Countdown } from '../countdown/countdown';
import { DatetimeSetter } from '../datetime-setter/datetime-setter';
import { environment } from '@env/environments';

@Component({
  selector: 'app-el-details-box',
  imports: [
    Countdown,
    DatetimeSetter
  ],
  templateUrl: './el-details-box.html',
  styleUrl: './el-details-box.scss',
})
export class ElDetailsBox {
    assetPath = environment.assetPath;
}
