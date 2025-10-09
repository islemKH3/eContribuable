import { Component, OnInit, HostListener} from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { AuthentService } from '../authent.service';
import { Router, RouterLink } from '@angular/router';
import { NotificationService, Notification } from '../notification.service';
import { AdminStatDTO } from '../models/Stats';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-page-admin',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './page-admin.component.html',
  styleUrl: './page-admin.component.css'
})
export class PageAdminComponent implements OnInit {

  
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  
  stats: AdminStatDTO = {
    nb_tot_user: 0,
    nb_contribuable: 0,
    nb_agent: 0,
    nb_admin: 0,

    nb_rec: 0,
    nb_rec_non_t: 0,
    nb_inter: 0,
  }

  contPercent = 0;
  adminPercent = 0;
  agentPercent = 0;

  recnontPercent = 0;

  utilisateur!: UtilisateurDTO;

  displayName = '';

  constructor(private statsService: StatsService, private notifService: NotificationService, private authService: AuthentService, private router: Router) {}

  ngOnInit(): void {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.utilisateur = JSON.parse(storedUser);
      }

      this.displayName = this.authService.getDisplayName();
      
      this.statsService.getAdminStat().subscribe({
        next: (data) => {
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

  calculatePercentages() {
    if (this.stats.nb_tot_user > 0) {
      this.contPercent = Math.round((this.stats.nb_contribuable / this.stats.nb_tot_user) * 100);
      this.adminPercent = Math.round((this.stats.nb_admin / this.stats.nb_tot_user) * 100);
      this.agentPercent = Math.round((this.stats.nb_agent / this.stats.nb_tot_user) * 100);
    }

    if (this.stats.nb_rec_non_t > 0) {
      this.recnontPercent = Math.round((this.stats.nb_rec_non_t / this.stats.nb_rec) * 100);
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
    this.router.navigate(['/profil_admin']);
  }
}
