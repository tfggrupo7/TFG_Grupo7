import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
rightPanelActive = false;

  onSignUp() {
    this.rightPanelActive = true;
  }

  onSignIn() {
    this.rightPanelActive = false;
  }
}
