import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { 
    PublicElectionResponse, 
    PublicFullElectionResponse,
    ElectionByCodeResponse
 } from '../../models/responses';
import { PublicElection } from '../../models/models';


@Injectable({
  providedIn: 'root'
})
export class ElectionService {
    private baseUrl = `${environment.API_URL ?? 'http://localhost:3000'}/elections`;

  constructor(private http: HttpClient) {}

  // GET /
  getAll(): Observable<PublicElectionResponse> {
    return this.http.get<PublicElectionResponse>(`${this.baseUrl}`);
  }

  // GET /:id
  getById(id: number): Observable<PublicElectionResponse> {
    return this.http.get<PublicElectionResponse>(`${this.baseUrl}/${id}`);
  }

  // GET /full/:id
  getFullById(id: number): Observable<PublicFullElectionResponse> {
    return this.http.get<PublicFullElectionResponse>(`${this.baseUrl}/full/${id}`);
  }

  // GET /code/:code
  getByCode(code: string): Observable<ElectionByCodeResponse> {
    return this.http.get<ElectionByCodeResponse>(`${this.baseUrl}/code/${code}`);
  }

  // POST /
  create(data: PublicElection): Observable<PublicElectionResponse> {
    return this.http.post<PublicElectionResponse>(`${this.baseUrl}`, data);
  }

  // PUT /:id
  update(id: number, data: PublicElection): Observable<PublicElectionResponse> {
    return this.http.put<PublicElectionResponse>(`${this.baseUrl}/${id}`, data);
  }

  // DELETE /:id
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}