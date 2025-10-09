import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthentService } from './authent.service';

export interface Notification {
  id: number;
  date: string;
  type: string;
  content: string;
  status: string;
  utilisateur: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient, private authService: AuthentService) {}

  getUserNotifs(type: string, status: string, id: number): Observable<Notification[]> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${type}/${status}/${id}`, {headers});
  }

  markAsRead(notifId: number): Observable<string> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.baseUrl}/${notifId}/read`, {}, {headers, responseType: 'text'});
  }
}
