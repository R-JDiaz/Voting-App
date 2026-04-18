import { Injectable } from '@angular/core';
import { CountdownInterface, DateTimeRange } from '@shared/models/data';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DateTimeService {
  private readonly dateTimeRangeSubject = new BehaviorSubject<DateTimeRange | null>(null)
  readonly dateTimeRange$ = this.dateTimeRangeSubject.asObservable();
  
  private readonly countdownSubject = new BehaviorSubject<CountdownInterface | null>(null);
  readonly countdown$ = this.countdownSubject.asObservable();

  private intervalId: any;

  setDateRange(startDate: string | null | undefined , endDate: string| null | undefined) {
    if (!startDate) {return};
    if (!endDate) {return};
    const start = this.formatToFullDateTime(startDate);
    const end = this.formatToFullDateTime(endDate);
    this.dateTimeRangeSubject.next({startDate: start, endDate: end});
    this.startCountdown();
  }

  private startCountdown() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const range = this.dateTimeRangeSubject.value;
      if (!range) { return }

      const now = new Date().getTime();
      const end = new Date(range.endDate).getTime();

      const diff = end - now;

      if (diff <= 0){
        this.countdownSubject.next({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        })
        clearInterval(this.intervalId);
        return;
      }

      this.countdownSubject.next(this.calculateCountdown(diff));
    }, 1000);
  }

  private calculateCountdown(diff: number): CountdownInterface {
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  formatToFullDateTime(value: string): string {
    const date = new Date(value);

    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  
}
