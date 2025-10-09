import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { AuthentService } from '../authent.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent implements AfterViewInit{


  emailLogin: string='';
  mdpLogin: string='';
  serverErrorMessage: string = '';
  serverErrorVisible: boolean = false;
  acceptMessage: string = '';
  acceptVisible: boolean = false;


  dismissServerError() {
    this.serverErrorVisible = false;
    this.serverErrorMessage = '';
  }

  showServerError(message: string) {
    this.serverErrorMessage = message;
    this.serverErrorVisible = true;

    setTimeout(() => this.dismissServerError(), 10000); // 10 seconds
  }

  dismissAcceptMessage() {
    this.acceptVisible = false;
    this.acceptMessage = '';
  }

  showAcceptMessage(message: string) {
    this.acceptMessage = message;
    this.acceptVisible = true;

    setTimeout(() => this.dismissAcceptMessage(), 10000); // auto-dismiss après 10s
  }

  constructor(private authService: AuthentService, private router: Router, private el: ElementRef) {}

  ngAfterViewInit(): void {
    const formPopup = this.el.nativeElement.querySelector(".form-popup");
    const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");


    signupLoginLink.forEach((link: any) => {
    link.addEventListener("click", (e: Event) => {
      e.preventDefault();
      if (link.id === 'signup-link') {
        formPopup.classList.add("show-signup");
      } else if (link.id === 'login-link') {
        formPopup.classList.remove("show-signup");
      }
    });
  });
  }

  clearInputsLogin() {
    this.emailLogin='';
    this.mdpLogin='';

    this.mdpError=false;
    this.emailInvalid=false;
    this.formHasErrors=false;
  }

  clearInputsSignup() {
    this.emailSignup='';
    this.nifSignup='';
    this.mdpSignup='';
    this.mdpVerifSignup='';

    this.emailInvalidS=false;
    this.nifError=false;
    this.mdpErrorS=false;
    this.mdpMismatch=false;
    this.termsError=false;
    this.termsAccepted=true;
    this.formHasErrorsS=false;
  }

  emailInvalid: boolean = false;

  private emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  mdpError: boolean = false;

  validatePassword(): void {
    const value = this.mdpLogin.trim();

    if (!value) {
      this.mdpError = false;
      return;
    }

    if (value.length < 8) {
      this.mdpError = true;
      this.showError('mdp');
    } else {
      this.dismissError('mdp');
    }
  }

  checkEmailValidity(): void {
    const email = this.emailLogin.trim();

    if (!email) {
      this.emailInvalid=false;
      return;
    }

    if (!this.emailRegex.test(email)) {
      this.emailInvalid = true;
      this.showError('email');
    } else {
      this.dismissError('email');
    }
  }

  formHasErrors: boolean = false;

  onLogin(){

    this.formHasErrors = false;

    const emailEmpty = !this.emailLogin || this.emailLogin.trim() === '';
    const mdpEmpty = !this.mdpLogin || this.mdpLogin.trim() === '';

    if (this.emailInvalid || this.mdpError || emailEmpty || mdpEmpty) {
      this.formHasErrors = true;
      return;
    }

    this.authService.logout();
    this.authService.login(this.emailLogin, this.mdpLogin).subscribe({
      next: (response) => {
        console.log(response);
        this.authService.logout();
        this.authService.storeToken(response.token);
        this.authService.storeUser(response.utilisateur);

        if (response.message === 'Redirection vers admin/home') {
          this.router.navigate (['page_admin']);
        } else if (response.message === 'Redirection vers client/home'){
          this.router.navigate(['page_user']);
        } else if (response.message === 'Redirection vers agent/home'){
          this.router.navigate(['page_agent']);
        }
      },
      error: (error) => { 
        this.showServerError("Authentification a échouée: " + error.error.message);
      }
    });
  }

    nifSignup: string='';
    emailSignup: string='';
    mdpSignup: string='';
    mdpVerifSignup: string='';
    natureSignup: string='';
    mdpMismatch: boolean = false;
    termsAccepted: boolean = true;
    termsError: boolean = false;
    emailInvalidS: boolean= false;
    nifError: boolean = false;
    mdpErrorS: boolean = false;
    formHasErrorsS: boolean = false;

    validatePasswordS(): void {
      const value = this.mdpSignup.trim();

      if (!value) {
        this.mdpErrorS = false;
        return;
      }

      if (value.length < 8) {
        this.mdpErrorS=true;
        this.showError('mdpS');
      } else {
        this.dismissError('mdpS');
      }
    }

    checkEmailValidityS(): void {
      const email = this.emailSignup.trim();

      if (!email) {
        this.emailInvalidS=false;
        return;
      }

      if (!this.emailRegex.test(email)) {
        this.emailInvalidS=true;
        this.showError('emailS');
      } else {
        this.dismissError('emailS');
      }
    }

    validateNIF(): void{
      const pattern = /^\d+$/;
      const value = this.nifSignup.trim();

      if (!value) {
        this.nifError = false;
        return;
      }

      if (!pattern.test(value)) {
        this.nifError=true;
        this.showError('nif');
      } else {
        this.dismissError('nif');
      }
    }

    checkPasswords(){
      if (this.mdpSignup !== this.mdpVerifSignup) {
        this.mdpMismatch= true;
        this.showError('mdpMis');
      } else {
        this.dismissError('mdpMis');
      }
    }

    validateTerms(): void {
      if (!this.termsAccepted) {
        this.termsError=true;
        this.showError('terms');
      } else {
        this.dismissError('terms');
      }
    }

    onSignup(){

      this.formHasErrorsS = false;
      const emailEmpty = !this.emailSignup || this.emailSignup.trim() ==='';
      const nifEmpty = !this.nifSignup || this.nifSignup.trim() ==='';
      const mdpEmpty = !this.mdpSignup || this.mdpSignup.trim() ==='';
      const mdpVEmpty = !this.mdpVerifSignup || this.mdpVerifSignup.trim() ==='';

      if (emailEmpty || nifEmpty || mdpEmpty || mdpVEmpty || this.nifError || this.emailInvalidS || this.mdpErrorS || this.mdpMismatch || this.termsError) {
        this.formHasErrorsS = true;
        return;
      }
    
      this.authService.signUp(Number(this.nifSignup), this.emailSignup, this.mdpSignup).subscribe({
        next: (res) => {
          this.showAcceptMessage(res.message);
        },
        error: (error) => {
          this.showServerError("Inscription a échoué: " + error.error.message);
        },
        complete: () => {
          console.log('succée');
        }
      });
    }

    dismissError(type: 'email' | 'emailS' | 'mdp' | 'mdpS' | 'mdpMis' | 'nif' | 'terms') {

      const el = document.querySelector(`.error-message.${type}`);
      if (el) el.classList.add('fade-out');

      setTimeout (() => {

        if (type === 'email') this.emailInvalid = false;
        if (type === 'emailS') this.emailInvalidS = false;
        if (type === 'mdp') this.mdpError = false;
        if (type === 'mdpS') this.mdpErrorS = false;
        if (type === 'mdpMis') this.mdpMismatch = false;
        if (type === 'nif') this.nifError = false;
        if (type === 'terms') this.termsError = false;

      }, 300);
      
    }

    showError(type: 'email' | 'emailS' | 'mdp' | 'mdpS' | 'mdpMis' | 'nif' | 'terms') {
      if (type === 'email') this.emailInvalid = true;
      if (type === 'emailS') this.emailInvalidS = true;
      if (type === 'mdp') this.mdpError = true;
      if (type === 'mdpS') this.mdpErrorS = true;
      if (type === 'mdpMis') this.mdpMismatch = true;
      if (type === 'nif') this.nifError = true;
      if (type === 'terms') this.termsError = true;

      setTimeout(() => {
        this.dismissError(type);
      }, 20000);
  }

  }
