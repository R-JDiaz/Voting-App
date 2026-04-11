import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';
import { Router, RouterModule } from '@angular/router';
import { Toast } from '../../toast/toast';
import { ToastService } from '../../../services/toast/toast';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, Toast],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.authService.register(this.signupForm.value).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message || 'Registration successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.toastService.showError(err.error?.message || 'Registration failed!');
      },
    });
  }
}