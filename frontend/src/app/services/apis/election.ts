import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { PublicElection, PublicFullElection } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
    private baseUrl = `${environment.API_URL ?? 'http://localhost:3000'}/elections`;

  constructor(private http: HttpClient) {}

  // GET /
  getAll(): Observable<PublicElection[]> {
    return this.http.get<PublicElection[]>(`${this.baseUrl}`);
  }

  // GET /:id
  getById(id: number): Observable<PublicElection> {
    return this.http.get<PublicElection>(`${this.baseUrl}/${id}`);
  }

  // GET /full/:id
  getFullById(id: number): Observable<PublicFullElection> {
    return this.http.get<PublicFullElection>(`${this.baseUrl}/full/${id}`);
  }

  // GET /code/:code
  getByCode(code: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/code/${code}`);
  }

  // POST /
  create(data: PublicElection): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // PUT /:id
  update(id: number, data: PublicElection): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // DELETE /:id
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}