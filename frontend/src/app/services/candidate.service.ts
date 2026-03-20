import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Candidate } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCandidatesByPosition(positionId: number): Observable<ApiResponse<Candidate[]>> {
    return this.http.get<ApiResponse<Candidate[]>>(`${this.apiUrl}/positions/${positionId}/candidates`);
  }

  getCandidateById(id: number): Observable<ApiResponse<Candidate>> {
    return this.http.get<ApiResponse<Candidate>>(`${this.apiUrl}/candidates/${id}`);
  }

  createCandidate(positionId: number, candidate: Partial<Candidate>): Observable<ApiResponse<Candidate>> {
    return this.http.post<ApiResponse<Candidate>>(`${this.apiUrl}/positions/${positionId}/candidates`, candidate);
  }

  updateCandidate(id: number, candidate: Partial<Candidate>): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/candidates/${id}`, candidate);
  }

  deleteCandidate(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/candidates/${id}`);
  }
}
