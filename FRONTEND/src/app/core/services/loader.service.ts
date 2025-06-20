import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private component: { visible: boolean } | null = null;
  private count = 0;

  register(component: { visible: boolean }) {
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
      this.component.visible = this.count > 0;
    }
  }
}
