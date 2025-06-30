import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chatbot-widget',
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class ChatbotWidgetComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('chatToggle') chatToggle!: ElementRef;
  @ViewChild('chatBody') chatBody!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('sendButton') sendButton!: ElementRef;
  @ViewChild('chatArrow') chatArrow!: ElementRef;

  isOpen = false;
  inputText: string = '';
  messages: { text: string, user: boolean }[] = [];

  fallbackReplies: string[] = [
    'Disculpa, no tengo una respuesta para tu mensaje, pero trabajaremos en ello.',
    'Lo siento, todavía no estoy preparado para responder eso.',
    'Esa pregunta me supera por ahora. ¡Gracias por tu paciencia!',
    'No tengo una respuesta clara para eso, pero puedes contactar con soporte si lo deseas.',
    'Estoy aprendiendo... aún no sé cómo ayudarte con eso.'
  ];

  ngOnInit(): void { }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    const chat = this.chatContainer.nativeElement;

    if (this.isOpen) {
      this.positionChat();
      chat.style.display = 'flex';
      setTimeout(() => {
        chat.style.transform = 'scale(1)';
        chat.style.opacity = '1';
        this.adjustArrow();
      }, 10);
    } else {
      chat.style.transform = 'scale(0.8)';
      chat.style.opacity = '0';
      setTimeout(() => {
        chat.style.display = 'none';
      }, 300);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isOpen) {
      this.positionChat();
      this.adjustArrow();
    }
  }

  positionChat(): void {
    const toggleRect = this.chatToggle.nativeElement.getBoundingClientRect();
    const chatWidth = 300;
    const chatHeight = 400;
    const marginBottom = 10;

    const left = toggleRect.left + toggleRect.width / 2 - chatWidth;
    const top = toggleRect.top - chatHeight - marginBottom;

    const chat = this.chatContainer.nativeElement;
    chat.style.left = `${left}px`;
    chat.style.top = `${top}px`;
  }

  adjustArrow(): void {
    const button = this.sendButton.nativeElement;
    const arrow = this.chatArrow.nativeElement;

    if (!button || !arrow) return;

    const ancho = button.offsetWidth;
    arrow.style.borderLeftWidth = `${ancho / 2}px`;
    arrow.style.borderRightWidth = `${ancho / 2}px`;

    const botonOffsetLeft = button.offsetLeft;
    const botonWidth = button.offsetWidth;
    const flechaCenter = botonOffsetLeft + botonWidth / 2;
    const flechaWidth = ancho;

    arrow.style.left = `${flechaCenter - flechaWidth / 2}px`;
  }

  appendMessage(text: string, isUser: boolean): void {
    this.messages.push({ text, user: isUser });
    setTimeout(() => {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }, 0);
  }


  async sendMessage(): Promise<void> {
    const input = this.messageInput.nativeElement;
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
