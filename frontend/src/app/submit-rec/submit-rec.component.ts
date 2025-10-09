import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../reclamation.service';
import { AuthentService } from '../authent.service';
import { UtilisateurDTO } from '../models/login-response';
import { OcrService } from '../ocr.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Reclamation } from '../models/Reclamation';
import { NotificationService, Notification } from '../notification.service';

@Component({
  selector: 'app-submit-rec',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './submit-rec.component.html',
  styleUrl: './submit-rec.component.css'
})

export class SubmitRecComponent implements OnInit{
  objet = '';
  message = '';
  utilisateur! : UtilisateurDTO;
  files: File[] = [];
  ocrResult: string[] = [];
  loading = false;
  userId:number = 0;
  notifications: Notification[] = [];
  notifications_read: Notification[] = [];

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


  displayName='';

  constructor(private notifService: NotificationService, private ocrService: OcrService, private reclamationService: ReclamationService, private authService: AuthentService, private el: ElementRef, private router: Router) {}

  ngOnInit() {

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

  selectedFilesNames :string[] =[];

async onFileChange(event: any) {
  const selectedFiles = Array.from(event.target.files) as File[];
  this.files = [];
  this.selectedFilesNames = [];
  this.ocrResult = [];
  this.loading = true;

  for (const file of selectedFiles) {
    if (!file) continue;

    this.files.push(file);
    this.selectedFilesNames.push(file.name);

    const isPdf = file.type === 'application/pdf';
    try {
      const result = isPdf
        ? await this.ocrService.recognizeTextFromPdf(file)
        : await this.ocrService.recognizeTextFromImage(file);
      this.ocrResult.push(result);
    } catch (error) {
      console.error(`OCR failed for file ${file.name}`, error);
      this.ocrResult.push(`OCR error for ${file.name}`);
    }
  }

  await this.ocrService.terminateWorker();
  this.loading = false;
}

  onSubmit() {

    const reclamation: Reclamation = {
      id: 0,
      status: 'NON_TRAITEE',
      date_reclamation: '',
      nom:'',
      prenom:'',
      raison_sociale:'',
      objet: this.objet,
      contenu_rec: this.message,
      id_utilisateur: this.userId
    };
  
    this.reclamationService.createReclamationWithFiles(reclamation, this.files, this.ocrResult).subscribe({
      next: (response) => {
      console.log('Reclamation created:', response);

      this.showAcceptMessage('Réclamation envoyée avec succès.');
      
      this.files = [];
      this.selectedFilesNames = [];
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value ='';

      this.objet = '';
      this.message = '';
      },

      error: (error) => {
        console.error(error);
        this.showErrorMessage('Erreur lors de l’envoi de la réclamation : ' + error.error.message);
      }
    });
  }
}
