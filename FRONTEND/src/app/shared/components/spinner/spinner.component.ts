import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  loaderService = inject(LoaderService)

  isActive: boolean = false

  ngOnInit() {
    this.loaderService.register(this);
  }

}
