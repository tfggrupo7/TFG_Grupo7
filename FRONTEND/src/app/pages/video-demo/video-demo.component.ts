import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-video-demo',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './video-demo.component.html',
  styleUrl: './video-demo.component.css'
})
export class VideoDemoComponent {

}
