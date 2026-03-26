import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Election } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private apiUrl = `${environment.apiUrl}/elections`;

  constructor(private http: HttpClient) { }

  // Fetch all elections
  // Server will return only joined elections for normal users
  getAllElections(): Observable<ApiResponse<Election[]>> {
    return this.http.get<ApiResponse<Election[]>>(this.apiUrl);
  }

  // Fetch a specific election by ID
  getElectionById(id: number): Observable<ApiResponse<Election>> {
    return this.http.get<ApiResponse<Election>>(`${this.apiUrl}/${id}`);
  }

  // Create a new election (admin)
  createElection(election: Partial<Election>): Observable<ApiResponse<Election>> {
    return this.http.post<ApiResponse<Election>>(this.apiUrl, election);
  }

  // Update an existing election (admin)
  updateElection(id: number, election: Partial<Election>): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, election);
  }

  // Delete an election (admin)
  deleteElection(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Join an election
  joinElection(electionId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${electionId}/join`, {});
  }
}