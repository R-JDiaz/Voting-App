import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datetime-setter',
  imports: [FormsModule],
  templateUrl: './datetime-setter.html',
  styleUrl: './datetime-setter.scss',
})
export class DatetimeSetter {
   startDateTime: string = '2026-09-27T10:20:10';  // Format: YYYY-MM-DDTHH:mm:ss
  endDateTime: string = '2026-09-28T21:10:16';

  // Optional: Methods to handle changes and format display like the image
  onStartDateTimeChange(event: any): void {
    const value = event.target.value;
    if (value) {
      // Store in the required format
      this.startDateTime = value;
      // You can also format it for display if needed
      console.log('Formatted Start:', this.formatDateTime(value));
    }
  }

  onEndDateTimeChange(event: any): void {
    const value = event.target.value;
    if (value) {
      this.endDateTime = value;
      console.log('Formatted End:', this.formatDateTime(value));
    }
  }

  // Helper method to format datetime to match image style: "09 | 27 | 2026 - 10 : 20 : 10"
  formatDateTime(datetime: string): string {
    if (!datetime) return '';
    const [date, time] = datetime.split('T');
    const [year, month, day] = date.split('-');
    const formattedDate = `${month} | ${day} | ${year}`;
    const formattedTime = time.replace(/:/g, ' : ');
    return `${formattedDate} - ${formattedTime}`;
  }

  // Optional: Getter to retrieve formatted values for display elsewhere
  get formattedStartDateTime(): string {
    return this.formatDateTime(this.startDateTime);
  }

  get formattedEndDateTime(): string {
    return this.formatDateTime(this.endDateTime);
  }
}
