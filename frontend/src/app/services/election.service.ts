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

  getAllElections(): Observable<ApiResponse<Election[]>> {
    return this.http.get<ApiResponse<Election[]>>(this.apiUrl);
  }

  getElectionById(id: number): Observable<ApiResponse<Election>> {
    return this.http.get<ApiResponse<Election>>(`${this.apiUrl}/${id}`);
  }

  createElection(election: Partial<Election>): Observable<ApiResponse<Election>> {
    return this.http.post<ApiResponse<Election>>(this.apiUrl, election);
  }

  updateElection(id: number, election: Partial<Election>): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, election);
  }

  deleteElection(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
