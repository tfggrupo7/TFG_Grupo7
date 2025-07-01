import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-modal.component.html'
})
export class FormModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() formGroup: FormGroup | null = null;
  @Input() submitLabel = 'Guardar';
  @Input() isEditMode = false;
  @Input() showDelete = false;
  @Input() isSubmitting = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
