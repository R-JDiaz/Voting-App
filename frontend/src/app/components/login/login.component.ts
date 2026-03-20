import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

async onSubmit(): Promise<void> {
  this.submitted = true;
  this.error = '';

  if (this.loginForm.invalid) {
    return;
  }

  this.loading = true;

  try {
       console.log('Calling login...');
    const response = await firstValueFrom(this.authService.login(this.loginForm.value));
    console.log('Response received:', response);

    console.log('Response received:', response);

    if (response.success) {
      console.log('Login success, navigating to:', this.returnUrl);
      this.router.navigate([this.returnUrl]);
    } else {
      console.log('Login failed, message:', response.message);
      this.error = response.message || 'Login failed. Please try again.';
    }
  } catch (error: any) {
    console.error('Error caught in onSubmit:', error);

    if (error.status === 400) {
      this.error = error.error?.message || 'Bad request. Please check your input.';
    } else if (error.status === 401) {
      this.error = error.error?.message || 'Unauthorized. Invalid credentials.';
    } else if (error.status === 403) {
      this.error = error.error?.message || 'Forbidden. You do not have access.';
    } else {
      this.error = error.error?.message || 'Login failed. Please try again.';
    }
  } finally {
    this.loading = false;
    console.log('Finalize: loading reset to false');
  }
}
}
