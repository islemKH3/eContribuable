import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { Router } from '@angular/router';
import { ChatbotService } from '../chatbot.service';
import { UtilisateurDTO } from '../models/login-response';
import { AuthentService } from '../authent.service';
import { NotificationService, Notification } from '../notification.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chatbot-admin',
  standalone: true,
  imports: [CommonModule, NgForOf, RouterLink],
  templateUrl: './chatbot-admin.component.html',
  styleUrl: './chatbot-admin.component.css'
})

export class ChatbotAdminComponent implements OnInit{
  chats: any[] = [];
  utilisateur!: UtilisateurDTO;
  messages: { input: string, output: string }[] = [];
  displayName = '';
  activeChat: number | null = null;
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  constructor(private notifService: NotificationService, private chatbotService: ChatbotService, private authService: AuthentService, private router: Router, ){}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.utilisateur = JSON.parse(storedUser);
    }

    this.displayName = this.authService.getDisplayName();

    this.chatbotService.getChatsHistory().subscribe({
      next: data => this.chats = data,
      error: err => console.error('Failed to load chats', err)
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
  
  openChat(userId:number) {
    this.activeChat = userId;
    this.chatbotService.getUserChatHistory(userId).subscribe(history => {
      this.messages = history.map(msg => ({
        input: msg.msg_input,
        output: msg.output?.msg_output || ''
      }));
    });
  }

  closePopup() {
    this.activeChat = null;
    this.messages = [];
  }
  menuOpen = false;
  notifsOpen=false;
  settingsOpen=false;
  showPopup = false;

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
