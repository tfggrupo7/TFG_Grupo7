import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";
import { ChatbotWidgetComponent } from "./chatbot-widget/chatbot-widget.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster, SpinnerComponent, ChatbotWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontEnd';

}
