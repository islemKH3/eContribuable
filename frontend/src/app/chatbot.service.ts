import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AskChatDTO } from './models/AskRequestDTO';
import { InputDTO } from './models/InputDTO';
import { AuthentService } from './authent.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient, private authService: AuthentService) {}

  askQuestion(question: AskChatDTO): Observable<string> {
    return this.http.post("http://localhost:8080/api/chatbot/ask", question, {
    responseType: 'text'
  }) as Observable<string>;
  }

  getUserChatHistory(userId: number): Observable<InputDTO[]> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<InputDTO[]>(`http://localhost:8080/api/chatbot/user/${userId}`, {headers});
  }

  getChatsHistory(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>("http://localhost:8080/api/chatbot/admin/all", {headers});
  }
}
