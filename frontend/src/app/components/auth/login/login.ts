import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
    loginForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Reset login status
    // this.logout();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Simulate login API call
    this.login(this.f['username'].value, this.f['password'].value);
  }

  login(username: string, password: string) {
    // This is a mock login - replace with actual authentication service
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        // Successful login
        localStorage.setItem('currentUser', JSON.stringify({ username: username }));
        this.router.navigate(['/dashboard']); // Redirect to dashboard or home page
      } else {
        // Failed login
        this.error = 'Invalid username or password';
        this.loading = false;
      }
    }, 1000);
  }

  logout() {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
