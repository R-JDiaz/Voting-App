import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-countdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown {
  startDateTime: string = '';
  endDateTime: string = '';

    // Properties for countdown timer (optional - if you want to bind them)
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  
  // You can also add these if you want to track the timer values
  // If you want to bind the timer inputs to component properties, add:
  // [(ngModel)]="hours" on the hours input
  // [(ngModel)]="minutes" on the minutes input  
  // [(ngModel)]="seconds" 
  constructor() {
    // Optional: Set default values
    this.initializeDefaultDates();
  }

  /**
   * Initialize default datetime values
   * Sets start date to current date/time
   * Sets end date to 1 day later
   */
  initializeDefaultDates(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    // Format: YYYY-MM-DDTHH:mm
    this.startDateTime = this.formatDateTimeLocal(now);
    this.endDateTime = this.formatDateTimeLocal(tomorrow);
  }

  /**
   * Format date to datetime-local input format
   * @param date - Date object to format
   * @returns Formatted string in YYYY-MM-DDTHH:mm format
   */
  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Called when start datetime changes
   * @param event - Input change event
   */
  onStartDateTimeChange(event: any): void {
    this.startDateTime = event.target.value;
    console.log('Start date changed:', this.startDateTime);
    // Add your validation logic here
    this.validateDates();
  }

  /**
   * Called when end datetime changes
   * @param event - Input change event
   */
  onEndDateTimeChange(event: any): void {
    this.endDateTime = event.target.value;
    console.log('End date changed:', this.endDateTime);
    // Add your validation logic here
    this.validateDates();
  }

  /**
   * Validate that end date is after start date
   * @returns boolean indicating if dates are valid
   */
  validateDates(): boolean {
    if (!this.startDateTime || !this.endDateTime) {
      return false;
    }
    
    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    
    if (end <= start) {
      console.warn('End date must be after start date');
      // You can add user notification here
      return false;
    }
    
    return true;
  }

  /**
   * Get calculated duration between start and end dates
   * @returns Object with hours, minutes, seconds difference
   */
  calculateDuration(): { hours: number; minutes: number; seconds: number } {
    if (!this.startDateTime || !this.endDateTime) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    
    if (diffMs <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  }

  /**
   * Update countdown timer values based on calculated duration
   * Call this method when dates change to auto-update the timer
   */
  updateTimerFromDates(): void {
    const duration = this.calculateDuration();
    this.hours = duration.hours;
    this.minutes = duration.minutes;
    this.seconds = duration.seconds;
  }

  /**
   * Called when hours input changes
   * @param value - New hours value
   */
  onHoursChange(value: number): void {
    this.hours = value;
    console.log('Hours changed:', this.hours);
    // Add your custom logic here
  }

  /**
   * Called when minutes input changes
   * @param value - New minutes value
   */
  onMinutesChange(value: number): void {
    this.minutes = value;
    console.log('Minutes changed:', this.minutes);
    // Add validation to keep minutes between 0-59
    if (this.minutes > 59) {
      this.minutes = 59;
    } else if (this.minutes < 0) {
      this.minutes = 0;
    }
  }

  /**
   * Called when seconds input changes
   * @param value - New seconds value
   */
  onSecondsChange(value: number): void {
    this.seconds = value;
    console.log('Seconds changed:', this.seconds);
    // Add validation to keep seconds between 0-59
    if (this.seconds > 59) {
      this.seconds = 59;
    } else if (this.seconds < 0) {
      this.seconds = 0;
    }
  }
}
