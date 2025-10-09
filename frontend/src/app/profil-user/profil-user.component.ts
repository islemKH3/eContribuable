import { Component, HostListener, OnInit } from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { AuthentService } from '../authent.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { NotificationService, Notification } from '../notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil-user',
  imports: [CommonModule, FormsModule,NgIf, RouterLink],
  templateUrl: './profil-user.component.html',
  styleUrl: './profil-user.component.css'
})
export class ProfilUserComponent implements OnInit {

  constructor(private notifService: NotificationService, private authService: AuthentService, private router: Router) {}

  displayName = '';
  userId:number = 0;
  utilisateur!: UtilisateurDTO;
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.utilisateur = JSON.parse(storedUser);
      this.userId=this.utilisateur?.id;
    }

    this.displayName = this.authService.getDisplayName();
  this.loadNotfications();
  }

  loadNotfications () {

    this.notifications = [];
    this.notifications_read = [];
    this.notifService.getUserNotifs("NRECLAMATION_APPROUV", "UNREAD", this.utilisateur.id).subscribe({
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

  toLower(value?: string): string {
    return value ? value.toLowerCase() : '';
  }

}
