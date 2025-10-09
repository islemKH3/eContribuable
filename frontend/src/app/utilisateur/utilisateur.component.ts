import { Component, OnInit, HostListener } from '@angular/core';
import { UtilisateurService } from '../utilisateur.service';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { AuthentService } from '../authent.service';
import { Router, RouterLink } from '@angular/router';
import { NotificationService, Notification } from '../notification.service';

@Component({
  standalone: true,
  selector: 'app-utilisateur',
  imports: [CommonModule, FormsModule, NgForOf, RouterLink],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css'
})
export class UtilisateurComponent implements OnInit {
  utilisateurs: UtilisateurDTO[] = [];
  loading = false;
  error = '';
  utilisateur!: UtilisateurDTO;
  displayName = '';
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  selectedDetails: UtilisateurDTO | null = null;

  constructor(private notifService: NotificationService, private utilisateurService: UtilisateurService, private authService: AuthentService, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.utilisateur = JSON.parse(storedUser);
    }

    this.displayName = this.authService.getDisplayName();

    this.loadUsers();
    this.loadNotfications();
  }

  loadUserDetails (user: UtilisateurDTO) {
    this.selectedDetails = user;
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

  loadUsers() {
    this.loading = true;
    this.utilisateurService.getAllClients().subscribe({
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
