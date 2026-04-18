import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

import { 
  PublicElection,
  PublicFullElection,
  UpdateElectionData
} from '../../models/models';

import {
  PublicElectionResponse,
  PublicFullElectionResponse,
  ElectionByCodeResponse,
  GetAllPublicElectionResponse
} from '../../models/responses';
import { ElectionByCodeData } from '../../models/data';

@Injectable({
  providedIn: 'root'
})

export class ElectionService {

  private baseUrl = `${environment.API_URL ?? 'http://localhost:3000'}/elections`;

  constructor(private http: HttpClient) {}

  // GET /
  getAll(): Observable<PublicElection[]> {
    return this.http.get<GetAllPublicElectionResponse>(`${this.baseUrl}`).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Failed to fetch elections');
        return res.data;
      })
    );
  }

  // GET /:id
  getById(id: number): Observable<PublicElection> {
    return this.http.get<PublicElectionResponse>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Failed to fetch election');
        return res.data;
      })
    );
  }

  // GET /full/:id
  getFullById(id: number): Observable<PublicFullElection> {
    return this.http.get<PublicFullElectionResponse>(`${this.baseUrl}/full/${id}`).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Failed to fetch full election');
        return res.data;
      })
    );
  }

  // GET /code/:code
  getByCode(code: string): Observable<ElectionByCodeData> {
    return this.http.get<ElectionByCodeResponse>(`${this.baseUrl}/code/${code}`).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Invalid election code');
        return res.data;
      })
    );
  }

  // POST /
  create(data: PublicElection): Observable<PublicElection> {
    return this.http.post<PublicElectionResponse>(`${this.baseUrl}`, data).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Create failed');
        return res.data;
      })
    );
  }

  // PUT /:id
  update(id: number, data: PublicElection): Observable<UpdateElectionData> {
    return this.http.put<PublicElectionResponse>(`${this.baseUrl}/${id}`, data).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Update failed');
        return res.data;
      })
    );
  }

  // DELETE /:id
  delete(id: number): Observable<boolean> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.baseUrl}/${id}`).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Delete failed');
        return true;
      })
    );
  }
}