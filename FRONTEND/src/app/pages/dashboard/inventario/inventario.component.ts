import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioFormComponent } from './inventario-form/inventario-form.component';
import { ModalComponent } from "../../../shared/components/modal/modal.component";

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true,
  imports: [CommonModule, ModalComponent, InventarioFormComponent]
})
export class InventarioComponent implements OnInit {
  // Datos de ejemplo para las métricas
  metrics = {
    totalProductos: {
      valor: '15',
      cambio: '3%',
      tendencia: '↑'
    },
    productosBajoStock: {
      valor: '6',
      cambio: '2%',
      tendencia: '↓'
    },
    categorias: {
      valor: '8'
    },
    proveedores: {
      valor: '11'
    },
    ultimaActualizacion: {
      valor: '25 de mayo de 2025'
    },
    categoriaMasUsada: {
      valor: 'Otros'
    }
  };

  // Datos de ejemplo para la tabla de productos
  productos = [
    {
      nombre: 'Tomates',
      categoria: 'Frutas y Verduras',
      cantidad: '25 kg',
      proveedor: 'Huerta Orgánica S.L.',
      estado: 'En stock',
      ultimaActualizacion: '2023-05-15'
    },
    {
      nombre: 'Pechuga de Pollo',
      categoria: 'Carnes',
      cantidad: '15 kg',
      proveedor: 'Carnes Premium S.A.',
      estado: 'En stock',
      ultimaActualizacion: '2023-05-16'
    },
    {
      nombre: 'Aceite de Oliva',
      categoria: 'Otros',
      cantidad: '5 l',
      proveedor: 'Aceites del Sur',
      estado: 'Bajo stock',
      ultimaActualizacion: '2023-05-14'
    }
  ];

  // Estado del filtro de búsqueda
  searchTerm: string = '';

  modalAbierto: Boolean = false
  constructor() { }

  ngOnInit(): void {
  }

  abrirFormProduct(){
    this.modalAbierto = true
  }

  closeModal(){
    this.modalAbierto = false;
  }

  sendForm(data: any){
    this.modalAbierto = false
  }

  // Método para añadir un nuevo producto
  agregarProducto(): void {
    // Implementar lógica para añadir producto
    console.log('Añadiendo nuevo producto...');
  }

  // Método para editar un producto
  editarProducto(producto: any): void {
    // Implementar lógica para editar producto
    console.log('Editando producto:', producto);
  }

  // Método para eliminar un producto
  eliminarProducto(producto: any): void {
    // Implementar lógica para eliminar producto
    console.log('Eliminando producto:', producto);
  }

  // Método para filtrar productos
  filtrarProductos(): void {
    // Implementar lógica de filtrado
    console.log('Filtrando productos...');
  }
}
