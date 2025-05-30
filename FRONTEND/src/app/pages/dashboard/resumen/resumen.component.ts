import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ResumenComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}

export default ResumenComponent;
