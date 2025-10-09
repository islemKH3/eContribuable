import { Injectable } from '@angular/core';
import { RecAgentStatsDTO } from './models/RecAgentStats';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:8080/api/dashboard'
  constructor(private http: HttpClient) { }

  getAgentStats(): Observable<RecAgentStatsDTO[]> {
    return this.http.get<RecAgentStatsDTO[]>(`${this.baseUrl}/agents/stats`);
  }

  getAgentResponsable(id: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/agent/${id}`, { responseType: 'text' })
  }
}
