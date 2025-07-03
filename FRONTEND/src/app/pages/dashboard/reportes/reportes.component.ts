import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ReportesComponent implements OnInit {
  // Datos de ejemplo para las métricas
  metrics = {
    ingresos: {
      valor: '€45,280',
      cambio: '15%',
      tendencia: '↑'
    },
    ordenes: {
      valor: '1,247',
      cambio: '8%',
      tendencia: '↑'
    },
    eficiencia: {
      valor: '92%',
      cambio: '3%',
      tendencia: '↑'
    },
    costos: {
      valor: '€18,950',
      cambio: '5%',
      tendencia: '↓'
    }
  };

  // Datos de ejemplo para las ventas por día
  ventasPorDia = [
    { dia: 'Lunes', valor: '€577', porcentaje: 89.264 },
    { dia: 'Martes', valor: '€495', porcentaje: 35.155 },
    { dia: 'Miércoles', valor: '€653', porcentaje: 13.5815 },
    { dia: 'Jueves', valor: '€204', porcentaje: 18.3205 },
    { dia: 'Viernes', valor: '€540', porcentaje: 36.5486 },
    { dia: 'Sábado', valor: '€469', porcentaje: 66.1652 },
    { dia: 'Domingo', valor: '€388', porcentaje: 50.659 }
  ];

  // Datos de ejemplo para las categorías más vendidas
  categoriasVendidas = [
    { nombre: 'Platos Principales', porcentaje: '45%', color: '#556B2F' },
    { nombre: 'Entrantes', porcentaje: '25%', color: '#D4AF37' },
    { nombre: 'Postres', porcentaje: '20%', color: 'gray' },
    { nombre: 'Bebidas', porcentaje: '10%', color: 'orange' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Método para exportar reportes
  exportarReporte(): void {
    // Implementar lógica de exportación
  }

  // Método para cambiar el período
  cambiarPeriodo(): void {
    // Implementar lógica de cambio de período
  }
}
