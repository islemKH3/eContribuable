import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReclamationService } from '../reclamation.service';
import { AuthentService } from '../authent.service';
import { Reclamation } from '../models/Reclamation';
import { FormsModule } from '@angular/forms';
import { UtilisateurDTO } from '../models/login-response';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import { ReclamationDetailsDTO } from '../models/ReclamationDetailsDTO';
import { FileDetailsDTO } from '../models/FileDetailsDTO';
import { NotificationService, Notification } from '../notification.service';
import { RouterLink } from '@angular/router';

interface TableRow {
  rec: Reclamation;
  statusColor: string; // holds 'green' | 'red' | 'yellow'
}

@Component({
  selector: 'app-consult-rec',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, RouterLink],
  templateUrl: './consult-rec.component.html',
  styleUrl: './consult-rec.component.css'
})

export class ConsultRecComponent implements OnInit{

  reclamations: Reclamation[] = [];
  rows: TableRow[]=[];
  utilisateur! : UtilisateurDTO;
  userId: number=0;
  displayName = '';
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  
  selectedDetails: ReclamationDetailsDTO | null = null;

  constructor(private notifService: NotificationService, private reclamationService: ReclamationService, private authService: AuthentService, private el: ElementRef, private router: Router) {
    this.rows.forEach(row => row.statusColor = this.getStatusColor(row.rec.status));
  }

  viewDetails(reclamationId: number) {
    this.reclamationService.getReclamationDetails(reclamationId).subscribe(details => {
      this.selectedDetails = details;
    });
  }

  downloadFile(file: FileDetailsDTO) {
    this.reclamationService.downloadFile(file);
  }
  
  getStatusColor(status: string): string {
    const s = status.toLowerCase();
    if (s === 'acceptee') return 'green';
    if (s === 'refusee') return 'red';
    if (s === 'non_traitee') return 'yellow';
    return 'grey';
  }

    getStatusLabel(status: string): string {
      const s = status.toLowerCase();
      if (s === 'non_traitee') return 'en cours de traitement';
      if (s === 'refusee') return 'refusée';
      if (s === 'acceptee') return 'acceptée';
      return status;
    }
  
    ngOnInit() {
  
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.utilisateur = JSON.parse(storedUser);
        this.userId=this.utilisateur?.id;
      }

      this.displayName = this.authService.getDisplayName();

      this.reclamationService.getReclamationByUser(this.userId).subscribe({
        next: data => {
          this.reclamations = data;
          this.rows = this.reclamations.map(rec => ({
            rec,
            statusColor: this.getStatusColor(rec.status)
          }));
        },
        error: err => console.error('Failed to load reclamations', err)
      });
    this.loadNotfications();
  }

  loadNotfications () {

    this.notifications = [];
    this.notifications_read = [];
    this.notifService.getUserNotifs("RECLAMATION_APPROUV", "UNREAD", this.utilisateur.id).subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error(err)
    });

    this.notifService.getUserNotifs("RECLAMATION_REFU", "UNREAD", this.utilisateur.id).subscribe({
      next: (data) => this.notifications = [...this.notifications, ...data],
      error: (err) => console.error(err)
    });

    this.notifService.getUserNotifs("RECLAMATION_APPROUV", "READ", this.utilisateur.id).subscribe({
      next: (data) => this.notifications_read = data,
      error: (err) => console.error(err)
    });

    this.notifService.getUserNotifs("RECLAMATION_REFU", "READ", this.utilisateur.id).subscribe({
      next: (data) => this.notifications_read = [...this.notifications_read, ...data],
      error: (err) => console.error(err)
    });
  }

  markAsRead(notif: Notification) {
    this.notifService.markAsRead(notif.id).subscribe(() => {
      this.loadNotfications();
    });
    this.router.navigate(['/consult_rec']);
  }

    menuOpen = false;
    notifsOpen=false;
    settingsOpen=false;
  
    toggleMenu(): void {
      this.menuOpen=true;
    }
  
    closeMenu(): void {
      this.menuOpen=false;
    }
  
    toggleNotifs() {
      this.notifsOpen = !this.notifsOpen;
      this.settingsOpen=false;
    }
  
    toggleSettings() {
      this.settingsOpen = !this.settingsOpen;
      this.notifsOpen = false;
    }
  
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
      const target = event.target as HTMLElement;
      if (!target.closest('.notif-btn') && !target.closest('.notifs')) {
        this.notifsOpen = false;
      }
      if (!target.closest('.settings-btn') && !target.closest('.settings')) {
        this.settingsOpen = false;
      }
    }
  
  
    logout() {
      this.authService.logout();
    }
  
    goProfile() {
      this.router.navigate(['/profil_user']);
    }

}
