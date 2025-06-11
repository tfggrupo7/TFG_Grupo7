import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private component: { isActive: boolean } | null = null;
  private count = 0;

  register(component: { isActive: boolean }) {
    this.component = component;
    this.update();
  }

  show() {
    this.count++;
    this.update();
  }

  hide() {
    this.count = Math.max(this.count - 1, 0);
    this.update();
  }

  private update() {
    if (this.component) {
      this.component.isActive = this.count > 0;
    }
  }
}
