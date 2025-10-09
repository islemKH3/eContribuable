import { Component, HostListener, ElementRef, OnInit, ViewChild} from '@angular/core';
import { UtilisateurDTO } from '../models/login-response';
import { CommonModule } from '@angular/common';
import { AuthentService } from '../authent.service';
import { Router, RouterLink } from '@angular/router';
import { ChatbotService } from '../chatbot.service';
import { FormsModule } from '@angular/forms';
import { AskChatDTO } from '../models/AskRequestDTO';
import { NgForOf } from '@angular/common';
import { StatsService } from '../stats.service';
import { NotificationService, Notification } from '../notification.service';
import { StatDTO } from '../models/Stats';

@Component({
  selector: 'app-page-user',
  imports: [CommonModule, FormsModule, NgForOf, RouterLink],
  standalone: true,
  templateUrl: './page-user.component.html',
  styleUrl: './page-user.component.css'
})
export class PageUserComponent implements OnInit{
  
  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;

  constructor(private notifService: NotificationService, private statService: StatsService, private el: ElementRef, private chatbotService: ChatbotService, private authService: AuthentService, private router: Router) {}
  
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];
  
  stats: StatDTO = {
    nb_rec: 0,
    nb_rec_ref: 0,
    nb_rec_acc: 0,
    nb_rec_non_t: 0,
  }

  accPercent!: number;
  refPercent!: number;
  nonTPercent!: number;

  userInput = '';
  userId:number = 0;
  messages: { input: string, output: string }[] = [];
  question: AskChatDTO={userId:0, question:''};
  isTyping = false;

  displayName = '';


  utilisateur!: UtilisateurDTO;

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  isOpen = false;

  toggleChat() {
    this.isOpen = !this.isOpen;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  scrollToBottom() {
    if (this.chatContainer) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.utilisateur = JSON.parse(storedUser);
      this.userId=this.utilisateur?.id;
    }

    this.displayName = this.authService.getDisplayName();

    this.statService.getClientStat(this.userId).subscribe({
        next: (data)=> {
          this.stats = data;
          this.calculatePercentages();
        },
        error: (err) => console.error(err)
    });

    this.chatbotService.getUserChatHistory(this.userId).subscribe(history => {
      this.messages = history.map(msg => ({
        input: msg.msg_input,
        output: msg.output?.msg_output || ''
      }));
    });

    this.loadNotfications();
  }

  loadNotfications () {

    this.notifications = [];
    this.notifications_read = [];
    this.notifService.getUserNotifs("RECLAMATION_APPROUV", "UNREAD", this.utilisateur.id).subscribe({
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

  calculatePercentages() {
    if (this.stats.nb_rec > 0) {
      this.accPercent = Math.round((this.stats.nb_rec_acc / this.stats.nb_rec) * 100);
      this.refPercent = Math.round((this.stats.nb_rec_ref / this.stats.nb_rec) * 100);
      this.nonTPercent = Math.round((this.stats.nb_rec_non_t / this.stats.nb_rec) * 100);
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const inputText = this.userInput;

    this.question = {
    userId: this.userId,
    question: inputText
    };

    const newMsg = { input: inputText, output: '' };
    this.messages.push(newMsg);
    this.userInput = '';
    this.isTyping = true;
    this.scrollToBottom();

    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
    });

    this.chatbotService.askQuestion(this.question).subscribe(fullResponse => {
      let index = 0;

      const streamInterval = setInterval(() => {
        if (index < fullResponse.length) {
          newMsg.output += fullResponse[index];
          index++;
          this.scrollToBottom();
        } else {
          clearInterval(streamInterval);
          this.isTyping = false;
          this.scrollToBottom();
        }
      }, 30);
    });
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline
     this.sendMessage();
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
    this.router.navigate(['/profil_user']);
  }
  
}
