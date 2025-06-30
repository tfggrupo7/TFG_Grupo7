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
  ngOnInit() {
    // Initialize AOS (Animate On Scroll) library
    
      AOS.init({
        duration: 1200, // Animation duration in milliseconds
        once: true, // Whether animation should happen only once while scrolling down
      });
      window.addEventListener('load', AOS.refresh);  
  }
}
