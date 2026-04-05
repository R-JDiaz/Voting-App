import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthResponse } from '../models/responses';
import { LoginRequest } from '../models/requests';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.API_URL || '';
  constructor(private http: HttpClient) {
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
    .pipe(
      tap(response => {
          if (response.success && response.data) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("currentUser", JSON.stringify(response.data.user));
          } else {
            console.error("login Failed");
          }
        }
      )
    )
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
}
