import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from './models/Reclamation';
import { ReclamationDetailsDTO } from './models/ReclamationDetailsDTO';
import { FileDetailsDTO } from './models/FileDetailsDTO';
import { blob } from 'stream/consumers';
import { AuthentService } from './authent.service';

@Injectable({
  providedIn: 'root'
})

export class ReclamationService {

  constructor(private http: HttpClient, private authService: AuthentService) { }

  getReclamationDetails (id: number): Observable<ReclamationDetailsDTO> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<ReclamationDetailsDTO>(`http://localhost:8080/api/reclamations/${id}/details`, {headers});
  }

  downloadFile (file: FileDetailsDTO) {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get(`http://localhost:8080/api/reclamations/files/${file.id}/download`, { responseType: 'blob', headers})
      .subscribe( blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = file.fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    });
  }

  createReclamationWithFiles(reclamation: Reclamation, files: File[], ocrTexts: string[]): Observable<any> {
   
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const formData= new FormData();
    formData.append('reclamation', new Blob([JSON.stringify(reclamation)], { type: 'application/json' }));

    if (ocrTexts && ocrTexts.length) {
      ocrTexts.forEach(text => formData.append('ocrText', text));
    }
    
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post("http://localhost:8080/api/reclamations/create-with-files", formData, {headers, responseType:'text'});
  }

  getReclamationByUser(userId: number): Observable<any[]>{
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Reclamation[]>(`http://localhost:8080/api/reclamations/user/${userId}`, {headers});
  }

  getAllReclamationsForAdmin(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any[]>(
      'http://localhost:8080/api/reclamations/admin/all',
      { headers }
    );
  }

  approveReclamation(recId: number, agentId: number): Observable<string> {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`http://localhost:8080/api/reclamations/${recId}/${agentId}/approve`, {}, {headers, responseType: 'text'});
  }

  refuseReclamation(recId: number, agentId: number, raison: string): Observable<any> {
  const token = localStorage.getItem('jwtToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post(
    `http://localhost:8080/api/reclamations/${recId}/${agentId}/refuse?raison=${encodeURIComponent(raison)}`, {},
    { headers, responseType: 'text' }
  );
}

  
}
