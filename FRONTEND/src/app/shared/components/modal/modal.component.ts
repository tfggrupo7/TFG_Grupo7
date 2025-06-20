import { Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: []
})
export class ModalComponent {

  @Input() showBtns: Boolean = false
  @Output() closeEvent = new EventEmitter<void>();
  @Output() acceptEvent = new EventEmitter<Boolean>();


  close() {
    this.closeEvent.emit();
  }

  accept(){
    this.acceptEvent.emit(true);
  }

}
