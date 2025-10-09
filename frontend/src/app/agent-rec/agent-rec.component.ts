import { Component, OnInit, HostListener } from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { ReclamationService } from '../reclamation.service';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Reclamation } from '../models/Reclamation';
import { ReclamationDetailsDTO } from '../models/ReclamationDetailsDTO';
import { FileDetailsDTO } from '../models/FileDetailsDTO';
import { NotificationService, Notification } from '../notification.service';
import { DashboardService } from '../dashboard.service';
import { RouterLink } from '@angular/router';

interface TableRow {
  rec: Reclamation;
  statusColor: string; // holds 'green' | 'red' | 'yellow'
}

@Component({
  selector: 'app-agent-rec',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agent-rec.component.html',
  styleUrl: './agent-rec.component.css'
})
export class AgentRecComponent implements OnInit {

  type!: string;
  reclamations: any[] = [];
    rows: TableRow[]=[];
    utilisateur!: UtilisateurDTO;
    displayName = '';
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  showPopup = false;
selectedRecId!: number;
rejectionReason = '';
  
  errorMessage: string = '';
errorVisible: boolean = false;

acceptMessage: string = '';
acceptVisible: boolean = false;

dismissErrorMessage() {
  this.errorVisible = false;
  this.errorMessage = '';
}

showErrorMessage(message: string) {
  this.errorMessage = message;
  this.errorVisible = true;
  setTimeout(() => this.dismissErrorMessage(), 10000); // disparaît après 10s
}

dismissAcceptMessage() {
  this.acceptVisible = false;
  this.acceptMessage = '';
}

showAcceptMessage(message: string) {
  this.acceptMessage = message;
  this.acceptVisible = true;
  setTimeout(() => this.dismissAcceptMessage(), 10000); // disparaît après 10s
}
    constructor(private dashboardService: DashboardService, private notifService: NotificationService, private reclamationService: ReclamationService, private authService: AuthentService, private router: Router) {
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

    get pendingRows() {
      return this.rows.filter(r => r.rec.status.toLowerCase() === 'non_traitee');
    }

    get treatedRows() {
      return this.rows.filter(r => r.rec.status.toLowerCase() !== 'non_traitee');
    }
  
    ngOnInit() {
  
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.utilisateur = JSON.parse(storedUser);
      }
  
      this.dashboardService.getAgentResponsable(this.utilisateur.id).subscribe({
        next: (data) => this.type= data,
        error: (err) => console.error(err)
      });

      this.displayName = this.authService.getDisplayName();
  
      this.loadRecs();

      this.loadNotfications();
    }

    loadRecs () {
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
    }

    loadNotfications () {

    this.notifications = [];
    this.notifications_read = [];

    this.notifService.getUserNotifs("NOUV_RECLAMATION", "UNREAD", this.utilisateur.id).subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error(err)
    });

    this.notifService.getUserNotifs("NOUV_RECLAMATION", "READ", this.utilisateur.id).subscribe({
      next: (data) => this.notifications_read =data,
      error: (err) => console.error(err)
    });
  }

  markAsRead(notif: Notification) {
    this.notifService.markAsRead(notif.id).subscribe(() => {
      this.loadNotfications();
    });
    this.router.navigate(['/agent_rec']);
  }

    approve(recId: number) {
      const agent = this.utilisateur;
      if (!agent) {
        console.error("No agent found");
        return;
      }

      this.reclamationService.approveReclamation(recId, agent.id).subscribe({
        next: res => {
          console.log(res);
          const row = this.rows.find(r => r.rec.id === recId);
          if (row) {
            row.rec.status = 'acceptee';
            row.statusColor = this.getStatusColor(row.rec.status);
          }
          this.showAcceptMessage('Réclamation acceptée avec succès.');
          this.loadRecs();
        },
        error: err => {
          console.error('Failed to approve', err);
          this.showErrorMessage('Erreur lors de l’approbation de la réclamation : ' + err.error.message);
          this.loadRecs();
        }
      });
    }

    
confirmRefuse() {
  const agent = this.utilisateur;
  if (!agent) {
    console.error("No agent found");
    return;
  }

  if (!this.rejectionReason.trim()) {
    this.showErrorMessage("Veuillez entrer une raison de rejet.");
    return;
  }

  this.reclamationService.refuseReclamation(this.selectedRecId, agent.id, this.rejectionReason).subscribe({
    next: res => {
      console.log(res);
      const row = this.rows.find(r => r.rec.id === this.selectedRecId);
      if (row) {
        row.rec.status = 'refusee';
        row.statusColor = this.getStatusColor(row.rec.status);
      }
      this.closePopup();
      this.showAcceptMessage('Réclamation refusée avec succès.');
      this.loadRecs();
    },
    error: err => {
      console.error('Failed to refuse', err);
      this.showErrorMessage('Erreur lors de le refus de la réclamation : ' + err.error.message);
      this.loadRecs();
      this.closePopup();
    }
  });
}

    openRejectPopup(recId: number) {
      this.selectedRecId = recId;
      this.rejectionReason = '';
      this.showPopup = true;
    }

    closePopup() {
      this.showPopup = false;
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
      this.router.navigate(['/profil_agent']);
    }

}
