import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupResponse } from './models/signup-response';
import { LoginResponse } from './models/login-response';
import { UtilisateurDTO } from './models/login-response';

@Injectable({
  providedIn: 'root'
})

export class AuthentService {
  constructor(private http: HttpClient) { }

  signUp(nif: number, email: string, mdp: string): Observable<SignupResponse> {
    
    return this.http.post<SignupResponse>("http://localhost:8080/auth/signup", { nif, email, mdp });
  }

  login(email: string, mdp: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>("http://localhost:8080/auth/login", { email, mdp});
  }

  storeUser(user: UtilisateurDTO) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  getUser(): UtilisateurDTO | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.warn("Aucun utilisateur trouvé dans localStorage");
      return null;
    }
    try{
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
    }
  }

  storeToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getDisplayName(): string {
    const utilisateur = this.getUser();
    if (!utilisateur){
      return '';
    }

    const nature = utilisateur.nature?.toLowerCase().trim() || '';
    const type = utilisateur.type?.toLowerCase().trim() || '';

    if (nature === 'client' && type === 'personnemorale') {
      return utilisateur.raison_sociale?.trim() || '';
    }

    const nom = utilisateur.nom?.trim() || '';
    const prenom = utilisateur.prenom?.trim() || '';

    return `${nom} ${prenom}`.trim();
  }

  router: Router = new Router;

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    this.router.navigate(['/connexion']);
  }
  
}
