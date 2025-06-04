import { Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: []
})
export class ModalComponent {

  @Output() closeEvent = new EventEmitter<void>();

  @Input() btnSendName: string = 'Enviar'

  close() {
    this.closeEvent.emit();
  }
}
