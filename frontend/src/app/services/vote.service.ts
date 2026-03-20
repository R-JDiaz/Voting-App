import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, VoteResult } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = `${environment.apiUrl}/votes`;

  constructor(private http: HttpClient) { }

  submitVote(candidateId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, { candidate_id: candidateId });
  }

  getElectionResults(electionId: number): Observable<ApiResponse<{ election: any, results: VoteResult[] }>> {
    return this.http.get<ApiResponse<{ election: any, results: VoteResult[] }>>(`${this.apiUrl}/results/${electionId}`);
  }
}
