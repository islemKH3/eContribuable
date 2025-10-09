import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilisateurDTO } from './models/login-response';
import { AuthentService } from './authent.service';

export interface UEAdto {
  id: number;
  nif: string;
  email: string;
  mdp: string;
  nom: string;
  prenom: string;
  raison_social: string;
  date_naissance: string;
  cin: string;
  registre_commerce: string;
  date_creation: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8080/api/utilisateurs';

  constructor(private http: HttpClient, private authService : AuthentService) {}

  getAllUtilisateurs(): Observable<UEAdto[]> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<UEAdto[]>(`${this.apiUrl}/utilisateurs-attente`, {headers});
  }

  getAllClients(): Observable<UtilisateurDTO[]> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}/inscris`, {headers});
  }

  approveUser(id: number): Observable<string> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.apiUrl}/${id}/approve`, {}, {headers, responseType: 'text'});
  }

  refuseUser(id: number): Observable<string> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${id}/refuse`, {headers, responseType: 'text'});
  }
}
