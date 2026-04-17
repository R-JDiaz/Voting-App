import { Component } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Countdown } from '../details/countdown/countdown';
import { DatetimeSetter } from '../details/datetime-setter/datetime-setter';

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
