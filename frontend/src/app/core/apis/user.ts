import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environments';
import { User } from '@shared/models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.API_URL ?? 'http://localhost:3000'}/users`;

  constructor(private http: HttpClient) {}

  // GET /
  getAll(): Observable<User[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(users =>
        users.map(user => ({
          ...user,
          can_create_election: !!user.can_create_election
        }))
      )
    );
    }

  // GET /:id
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  // GET /email/:email
  getByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/email/${email}`);
  }

  // POST /
  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, user);
  }

  // PUT /:id
  update(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  // PUT /password/:id
  updatePassword(id: string, payload: { password: string }) {
    return this.http.put(`${this.baseUrl}/password/${id}`, payload);
  }

  // DELETE /:id
  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}