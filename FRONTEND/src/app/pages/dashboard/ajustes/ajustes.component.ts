import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AjusteRestauranteComponent } from "./ajuste_restaurante/ajuste_restaurante.component";

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AjusteRestauranteComponent]
})
export class AjustesComponent implements OnInit {
  // Restaurant Information
  restaurantName: string = 'Restaurante El Olivo';
  cuisineType: string = 'Mediterránea';
  address: string = 'Calle Mayor 123, Madrid, España';
  phone: string = '+34 912 345 678';
  email: string = 'info@elolivo.com';

  // Personal Information
  firstName: string = 'Chef';
  lastName: string = 'Martínez';
  role: string = 'Chef Ejecutivo';
  personalEmail: string = 'chef.martinez@email.com';
  personalPhone: string = '+34 678 901 234';

  // Notification Preferences
  inventoryAlerts: boolean = true;
  shiftReminders: boolean = true;
  weeklyReports: boolean = false;
  emailNotifications: boolean = true;

  // Security
  twoFactorEnabled: boolean = true;

  // Theme and Language
  selectedTheme: string = 'light';
  selectedLanguage: string = 'Español';

  constructor() { }

  ngOnInit(): void {
  }

  saveRestaurantInfo(): void {
    // Implement save logic
  }

  updateProfile(): void {
    // Implement profile update logic
  }

  saveNotificationPreferences(): void {
    // Implement notification preferences save logic
  }

  changePassword(): void {
    // Implement password change logic
  }

  applyThemeChanges(): void {
    // Implement theme changes logic
  }
}
