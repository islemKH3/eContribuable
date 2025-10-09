import { Component, HostListener, OnInit} from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { AuthentService } from '../authent.service';
import { Router, RouterLink } from '@angular/router';
import { NotificationService, Notification } from '../notification.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-profil-agent',
  imports: [CommonModule, RouterLink],
  templateUrl: './profil-agent.component.html',
  styleUrl: './profil-agent.component.css'
})
export class ProfilAgentComponent implements OnInit{

  displayName = "";

  utilisateur!: UtilisateurDTO;

  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  type!: string;

  constructor(private dashboardService: DashboardService, private notifService: NotificationService, private authService: AuthentService, private router: Router) {}

  ngOnInit(): void {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.utilisateur = JSON.parse(storedUser);
      }

      this.dashboardService.getAgentResponsable(this.utilisateur.id).subscribe({
        next: (data) => this.type= data,
        error: (err) => console.error(err)
      });

      this.displayName = this.authService.getDisplayName();
      this.loadNotfications();
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

  toLower(value?: string): string {
    return value ? value.toLowerCase() : '';
  }

}
