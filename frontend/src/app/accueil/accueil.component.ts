import { Component, AfterViewInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements AfterViewInit {

  currentSlide = 0;

  slides = [
    {
      title: 'Contribuable',
      text: 'Vous pouvez déposer des réclamations, suivre leur état de traitement et interagir avec un chatbot.',
      link: '/connexion'
    },
    {
      title: 'Agent Fiscal',
      text: 'Vous pouvez consulter les réclamations déposées et effectuer leur traitement en ligne.'
    },
    {
      title: 'Administrateur',
      text: 'Vous pouvez approuver les inscriptions, consulter les utilisateurs et les réclamations, ainsi que l\'historique des conversations avec le chatbot.'
    }
  ];

  ngAfterViewInit() {
    this.showSlide(this.currentSlide);
  }

  showSlide (index: number): void {
    const slides = document.querySelectorAll('.features-slider .slide');
    slides.forEach ((slide, i) => {
      slide.classList.toggle('active', i ===index);
    });
  }

  showPreviousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  showNextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

}
