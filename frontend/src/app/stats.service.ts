import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthentService } from './authent.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private apiUrl ='http://localhost:8080/api/stat'

  constructor(private authService: AuthentService, private http: HttpClient) { }

  getClientStat(userId: number) :Observable<any> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/client/${userId}`, {headers});
  }

  getAdminStat(): Observable<any> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/admin`, {headers});
  }

  getAgentStat(): Observable<any> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/agent`, {headers});
  }
}
