import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Position } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPositionsByElection(electionId: number): Observable<ApiResponse<Position[]>> {
    return this.http.get<ApiResponse<Position[]>>(`${this.apiUrl}/elections/${electionId}/positions`);
  }

  getPositionById(id: number): Observable<ApiResponse<Position>> {
    return this.http.get<ApiResponse<Position>>(`${this.apiUrl}/positions/${id}`);
  }

  createPosition(electionId: number, position: Partial<Position>): Observable<ApiResponse<Position>> {
    return this.http.post<ApiResponse<Position>>(`${this.apiUrl}/elections/${electionId}/positions`, position);
  }

  updatePosition(id: number, position: Partial<Position>): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/positions/${id}`, position);
  }

  deletePosition(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/positions/${id}`);
  }
}
