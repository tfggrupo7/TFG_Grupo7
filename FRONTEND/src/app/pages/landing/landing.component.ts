import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import AOS from 'aos';
@Component({
  selector: 'app-landing',
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  mobileMenuOpen = false;

  // Typewriter effect
  typewriterTexts: string[] = [
    'eficiente',
    'óptima',
    'rápida',
    'innovadora',
    'flexible',
    'precisa',
    'automatizada',
    'sencilla',
    'inteligente',
    'integral'
  ];
  typewriterText: string = '';
  lastNonEmptyText: string = 'eficiente'; // Inicializar con el primer valor del array
  private typewriterIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typewriterTimeout: any;

  ngOnInit() {
    // Initialize AOS (Animate On Scroll) library
    AOS.init({
      duration: 1200, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once while scrolling down
    });
    window.addEventListener('load', AOS.refresh);
    this.startTypewriter();
  }

  startTypewriter() {
    const current = this.typewriterTexts[this.typewriterIndex % this.typewriterTexts.length];
    if (this.isDeleting) {
      this.typewriterText = current.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.typewriterText = current.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    // Guardar el último texto no vacío
    if (this.typewriterText.length > 0) {
      this.lastNonEmptyText = this.typewriterText;
    }

    let typeSpeed = 180; // Más lento
    if (!this.isDeleting && this.charIndex === current.length) {
      typeSpeed = 1800; // Pausa más larga al final de la palabra
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.typewriterIndex++;
      typeSpeed = 800;
      // No ocultar el span ni la clase typewriter, solo continuar
    }

    this.typewriterTimeout = setTimeout(() => this.startTypewriter(), typeSpeed);
  }

  ngOnDestroy() {
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
    }
  }
}
