import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  successMessage: string = '';
  errorMessage: string = '';
  
  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }
}
