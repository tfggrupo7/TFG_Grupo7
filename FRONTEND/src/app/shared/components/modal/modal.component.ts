import { Component, Type, ViewChild, ViewContainerRef, OnDestroy, ChangeDetectionStrategy, EnvironmentInjector, Input} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class ModalComponent implements OnDestroy {

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  public closeFn: () => void = () => {};

  loadComponent<T>(component: Type<T>, injector: EnvironmentInjector) {
    this.container.clear();
    this.container.createComponent(component, { environmentInjector: injector });
  }

  close() {
    this.closeFn();
  }

  ngOnDestroy() {
    this.container.clear();
  }
}
