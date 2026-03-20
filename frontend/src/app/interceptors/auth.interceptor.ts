import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // 🚨 Skip interceptor for auth routes
    if (
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/refresh')
    ) {
      return next.handle(request);
    }

    const token = this.authService.getToken();

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(

      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);

      })

    );
  }

  private addToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {

      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();

      // 🚨 No refresh token → logout
      if (!refreshToken) {

        this.isRefreshing = false;
        this.authService.logout();

        return throwError(() => new Error('No refresh token available'));

      }

      return this.authService.refreshToken().pipe(

        switchMap((response: any) => {

          this.isRefreshing = false;

          const newAccessToken = response.data.accessToken;

          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(this.addToken(request, newAccessToken));

        }),

        catchError((err) => {

          this.isRefreshing = false;
          this.authService.logout();

          return throwError(() => err);

        })

      );

    }

    // Wait for refresh token to complete
    return this.refreshTokenSubject.pipe(

      filter(token => token != null),
      take(1),

      switchMap(token => {
        return next.handle(this.addToken(request, token!));
      })

    );
  }

}