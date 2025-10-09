import { Component, OnInit, HostListener } from '@angular/core';
import { UtilisateurService, UEAdto } from '../utilisateur.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { UtilisateurDTO } from '../models/login-response';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../notification.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, FormsModule, NgForOf, RouterLink],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit {

  utilisateurs: UEAdto[] = [];
    loading = false;
    error = '';
    utilisateur!: UtilisateurDTO;
    displayName = '';
    notifications: Notification[] = [];
    notifications_read: Notification[] = [];
    selectedDetails: UEAdto | null = null;
  
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

    constructor(private notifService: NotificationService, private utilisateurService: UtilisateurService, private authService: AuthentService, private router: Router) {}
  
    ngOnInit(): void {
      this.loadUsers();

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.utilisateur = JSON.parse(storedUser);
      }

      this.displayName = this.authService.getDisplayName();

      this.loadNotfications();
    }

    loadUEA(uea: UEAdto) {
      this.selectedDetails = uea;
    }
  
    loadUsers() {
      this.loading = true;
      this.utilisateurService.getAllUtilisateurs().subscribe({
        next: (data) => {
          this.utilisateurs = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users';
          this.loading = false;
        }
      });
    }
  
    approve(id: number) {
      this.utilisateurService.approveUser(id).subscribe({
        next: () => {
          this.showAcceptMessage("Demande d'inscription acceptée avec succès.");
          this.loadUsers();
        },
        error: () => {
          console.log('Error approving user');
          this.showErrorMessage('Erreur lors de l’approbation de la demande : ' + this.error);
          this.loadUsers();
        }
      });
    }
  
    refuse(id: number) {
      this.utilisateurService.refuseUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.showAcceptMessage("Demande d'inscription refusée avec succès.");
        },
        error: () => {
          console.log('Error refusing user');
          this.loadUsers();
          this.showErrorMessage('Erreur lors de refus de la demande : ' + this.error);
        }
      });
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
