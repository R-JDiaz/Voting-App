import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../services/toast/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
})
export class Toast {
  successMessage = '';
  errorMessage = '';

  constructor(private toastService: ToastService) {
    this.toastService.success$.subscribe(msg => {
      this.successMessage = msg;
      setTimeout(() => this.successMessage = '', 3000);
    });

    this.toastService.error$.subscribe(msg => {
      this.errorMessage = msg;
      setTimeout(() => this.errorMessage = '', 3000);
    });
  }
}