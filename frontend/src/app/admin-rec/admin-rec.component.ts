import { Component, OnInit, HostListener } from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { ReclamationService } from '../reclamation.service';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { Reclamation } from '../models/Reclamation';
import { ReclamationDetailsDTO } from '../models/ReclamationDetailsDTO';
import { FileDetailsDTO } from '../models/FileDetailsDTO';
import { NotificationService, Notification } from '../notification.service';
import { RouterLink } from '@angular/router';

interface TableRow {
  rec: Reclamation;
  statusColor: string; // holds 'green' | 'red' | 'yellow'
}

@Component({
  selector: 'app-admin-rec',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, RouterLink],
  templateUrl: './admin-rec.component.html',
  styleUrls: ['./admin-rec.component.css']
})

export class AdminRecComponent implements OnInit {
  reclamations: any[] = [];
  rows: TableRow[]=[];
  utilisateur!: UtilisateurDTO;
  displayName = '';
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  userId!: number;
  role!: string;

  constructor(private notifService: NotificationService, private reclamationService: ReclamationService, private authService: AuthentService, private router: Router) {
    this.rows.forEach(row => row.statusColor = this.getStatusColor(row.rec.status));
  }

  selectedDetails: ReclamationDetailsDTO | null = null;

  viewDetails(reclamationId: number) {
    this.reclamationService.getReclamationDetails(reclamationId).subscribe(details => {
      this.selectedDetails = details;
    });
  }

  getStatusColor(status: string): string {
    const s = status.toLowerCase();
    if (s === 'acceptee') return 'green';
    if (s === 'refusee') return 'red';
    if (s === 'non_traitee') return 'yellow';
    return 'grey';
  }

  downloadFile(file: FileDetailsDTO) {
    this.reclamationService.downloadFile(file);
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
    }

    this.userId = this.utilisateur.id;
    this.role = this.utilisateur.nature; 

    this.displayName = this.authService.getDisplayName();

    this.reclamationService.getAllReclamationsForAdmin().subscribe({
      next: data => {
        this.reclamations = data;
        this.rows = this.reclamations.map(rec => ({
          rec,
          statusColor: this.getStatusColor(rec.status)
        }));
      },
      error: err => console.error('Failed to load reclamations', err)
    })
    
    this.loadNotfications();
  }

  loadNotfications () {

    this.notifications = [];
    this.notifications_read = [];
    this.notifService.getUserNotifs("NOUV_INSCRIPTION", "UNREAD", this.utilisateur.id).subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error(err)
    });

    this.notifService.getUserNotifs("NOUV_RECLAMATION", "UNREAD", this.utilisateur.id).subscribe({
      next: (data) => this.notifications = [...this.notifications, ...data],
      error: (err) => console.error(err)
    });

    this.notifService.getUserNotifs("NOUV_INSCRIPTION", "READ", this.utilisateur.id).subscribe({
      next: (data) => this.notifications_read = data,
      error: (err) => console.error(err)
    });

    this.notifService.getUserNotifs("NOUV_RECLAMATION", "READ", this.utilisateur.id).subscribe({
      next: (data) => this.notifications_read = [...this.notifications_read, ...data],
      error: (err) => console.error(err)
    });
  }

  markAsRead(notif: Notification) {
    this.notifService.markAsRead(notif.id).subscribe(() => {
      this.loadNotfications();
    });
    if (notif.type === "NOUV_INSCRIPTION")
      this.router.navigate(['/inscription']);

    if (notif.type === "NOUV_RECLAMATION")
      this.router.navigate(['/admin_rec']);
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
    this.router.navigate(['/profil_admin']);
  }
}
