import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chatbot-widget',
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatbotWidgetComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('chatToggle') chatToggle!: ElementRef;
  @ViewChild('chatBody', { static: false }) chatBody!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('sendButton') sendButton!: ElementRef;
  @ViewChild('chatArrow') chatArrow!: ElementRef;

  isOpen = false;
  inputText = '';
  messages: { text: string; user: boolean }[] = [];
  private shouldScroll = false;

  readonly fallbackReplies: string[] = [
    'Disculpa, no tengo una respuesta para tu mensaje, pero trabajaremos en ello.',
    'Lo siento, todavía no estoy preparado para responder eso.',
    'Esa pregunta me supera por ahora. ¡Gracias por tu paciencia!',
    'No tengo una respuesta clara para eso, pero puedes contactar con soporte si lo deseas.',
    'Estoy aprendiendo... aún no sé cómo ayudarte con eso.'
  ];

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom(): void {
    if (!this.chatBody?.nativeElement) return;

    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('[scrollToBottom] Fallo al hacer scroll:', err);
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.positionChat();
      this.adjustArrow();
      this.shouldScroll = true; // 🔄 Asegura que se haga scroll al reabrir
    }
  }



  @HostListener('window:resize')
  onResize(): void {
    if (this.isOpen && this.chatToggle?.nativeElement) {
      this.positionChat();
      this.adjustArrow();
    }
  }

  positionChat(): void {
    const toggle = this.chatToggle?.nativeElement;
    const container = this.chatContainer?.nativeElement;
    if (!toggle || !container) return;

    const rect = toggle.getBoundingClientRect();
    const width = 300;
    const height = 400;
    const margin = 10;

    container.style.left = `${rect.left + rect.width / 2 - width}px`;
    container.style.top = `${rect.top - height - margin}px`;
  }

  adjustArrow(): void {
    const button = this.sendButton?.nativeElement;
    const arrow = this.chatArrow?.nativeElement;
    if (!button || !arrow) return;

    const width = button.offsetWidth;
    const offsetLeft = button.offsetLeft;
    const center = offsetLeft + width / 2;

    arrow.style.borderLeftWidth = `${width / 2}px`;
    arrow.style.borderRightWidth = `${width / 2}px`;
    arrow.style.left = `${center - width / 2}px`;
  }

  appendMessage(text: string, isUser: boolean): void {
    this.messages.push({ text, user: isUser });
    this.shouldScroll = true;
  }

  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    if (!text) return;

    this.appendMessage(text, true);
    this.inputText = '';

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: 'cliente-frontend' })
      });

      const data = await response.json();
      const reply = data.reply?.trim();
      const fallback = this.fallbackReplies[Math.floor(Math.random() * this.fallbackReplies.length)];

      this.appendMessage(reply || fallback, false);

      if (data.endConversation) {
        setTimeout(() => {
          this.isOpen = false;
          this.messages = [];
        }, 1000);
      }
    } catch (err) {
      this.appendMessage('[Error de conexión]', false);
    }
  }

  handleEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
