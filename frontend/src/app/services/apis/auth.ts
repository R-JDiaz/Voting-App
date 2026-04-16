import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthResponse } from '../../models/responses';
import { LoginRequest, RegisterRequest } from '../../models/requests';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = environment.API_URL || '';
  
  constructor(private http: HttpClient) {
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  getRole(): string | null {
    const user = localStorage.getItem('currentUser');

    if (!user) return null;

    const parsed = JSON.parse(user);
    return parsed?.role ?? null;
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
    .pipe(
      tap(response => {
          if (response.success && response.data) {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("currentUser", JSON.stringify(response.data.user));
            console.log(response.data);
          } else {
            console.error("login Failed");
          }
        }
      )
    )
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
    .pipe(
      tap(response => {
          if (response.success && response.data) {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("currentUser", JSON.stringify(response.data.user));
          } else {
            console.error("login Failed");
          }
        }
      )
    )
  }
}
