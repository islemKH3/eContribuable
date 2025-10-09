import { Component, HostListener, OnInit} from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { StatsService } from '../stats.service';
import { NotificationService, Notification } from '../notification.service';
import { StatDTO } from '../models/Stats';
import { DashboardService } from '../dashboard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-agent',
  imports: [CommonModule, RouterLink],
  templateUrl: './page-agent.component.html',
  styleUrl: './page-agent.component.css'
})
export class PageAgentComponent implements OnInit{

  accPercent = 0;
  refPercent = 0;
  nonTPercent = 0;

  displayName = "";

  utilisateur!: UtilisateurDTO;

  stats: StatDTO ={
    nb_rec: 0,
    nb_rec_ref: 0,
    nb_rec_acc: 0,
    nb_rec_non_t: 0,
  }

  type!: string;
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];

  constructor(private dashboardService: DashboardService, private notifService: NotificationService, private statService: StatsService, private authService: AuthentService, private router: Router) {}

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
      this.statService.getAgentStat().subscribe({
        next: (data)=> {
          this.stats = data;
          this.calculatePercentages();
        },
        error: (err) => console.error(err)
      });

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

  calculatePercentages() {
    if (this.stats.nb_rec > 0) {
      this.accPercent = Math.round((this.stats.nb_rec_acc / this.stats.nb_rec) * 100);
      this.refPercent = Math.round((this.stats.nb_rec_ref / this.stats.nb_rec) * 100);
      this.nonTPercent = Math.round((this.stats.nb_rec_non_t / this.stats.nb_rec) * 100);
    }
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
