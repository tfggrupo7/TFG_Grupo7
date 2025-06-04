import { Injectable, ApplicationRef, ComponentRef, EnvironmentInjector, createComponent, Type, inject } from '@angular/core';
import { ModalComponent } from './../../shared/components/modal/modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalRef?: ComponentRef<ModalComponent>;
  appRef = inject(ApplicationRef)
  injector = inject(EnvironmentInjector)

  constructor( ) {}

  open<T>(component: Type<T>) {
    if (this.modalRef) return;

    this.modalRef = createComponent(ModalComponent, { environmentInjector: this.injector });

    this.modalRef.instance.loadComponent(component, this.injector);

    this.modalRef.instance.closeFn = () => this.close();

    this.appRef.attachView(this.modalRef.hostView);
    const domElem = this.modalRef.location.nativeElement;
    document.body.appendChild(domElem);
  }

  close() {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = undefined;
    }
  }
}
