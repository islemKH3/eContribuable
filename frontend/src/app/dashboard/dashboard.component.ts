import { Component, HostListener, OnInit} from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../notification.service';
import { DashboardService } from '../dashboard.service';
import { RecAgentStatsDTO } from '../models/RecAgentStats';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  displayName = "";

  utilisateur!: UtilisateurDTO;

  notifications: Notification[] = [];
  notifications_read: Notification[] = [];

  stats: RecAgentStatsDTO[] = [];

  topTraiteur!: RecAgentStatsDTO;
  topRefuseur!: RecAgentStatsDTO;
  topAccepteur!: RecAgentStatsDTO;

  constructor(private dashboardService: DashboardService, private notifService: NotificationService, private authService: AuthentService, private router: Router) {}

  ngOnInit(): void {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.utilisateur = JSON.parse(storedUser);
      }

      this.dashboardService.getAgentStats().subscribe({
        next: (data) => {
          this.stats = data;
          this.topTraiteur = [...data].sort((a, b) => b.totalTraite - a.totalTraite)[0];
          this.topRefuseur = [...data].sort((a, b) => b.totalRefuse - a.totalRefuse)[0];
          this.topAccepteur = [...data].sort((a, b) => b.totalAccepte - a.totalAccepte)[0];
        },
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

}
