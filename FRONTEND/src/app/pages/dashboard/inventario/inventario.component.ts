import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IIngredientes } from '../../../interfaces/iingredientes.interfaces';
import { IngredientesService } from '../../../core/services/ingredientes.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { InventarioFormComponent } from "./inventario-form/inventario-form.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { IInventarioResumen } from '../../../interfaces/iinventarioresumen.interface';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InventarioFormComponent, ModalComponent],
})
export class InventarioComponent implements OnInit {
  ingredientes: IIngredientes[] = [];
  arrIngredientes: IIngredientes[] = [];
  ingredientesFiltrados: IIngredientes[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  modalIngredienteAbierto = false;

  ingredienteId!: number;
  searchTerm = new FormControl('');

  totalItems = 0;
  ingrediente!: IIngredientes | null;
  summary!: IInventarioResumen;

  ingredientesService = inject(IngredientesService)
  router = inject(Router)

  constructor() {}

  async ngOnInit() {
    this.searchTerm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1; // resetea a la primera página
      this.init()
    });

    this.searchTerm.setValue('');
  }

  init() {
    this.cargarResumen()
    this.cargarIngredientes()
  }

  async cargarResumen() {
    this.summary = await this.ingredientesService.getResumen();
  }

  async cargarIngredientes() {
    const search = this.searchTerm.value ?? '';

    this.ingredientes = await this.ingredientesService.getIngredientes(
      this.currentPage, this.pageSize, search
    );

    this.ingredientesFiltrados = this.ingredientes;
    this.totalItems  = this.ingredientesService.totalItems;
    this.totalPages  = Math.ceil(this.totalItems / this.pageSize);
  }

  // paginación
  primera()   { if (this.currentPage !== 1)                 { this.currentPage = 1;                 this.cargarIngredientes(); } }
  anterior()  { if (this.currentPage > 1)                   { this.currentPage--;                   this.cargarIngredientes(); } }
  siguiente() { if (this.currentPage < this.totalPages)     { this.currentPage++;                   this.cargarIngredientes(); } }
  ultima()    { if (this.currentPage !== this.totalPages)   { this.currentPage = this.totalPages;   this.cargarIngredientes(); } }


  filtrarIngredientes(valor: string) {
    const texto = valor.trim().toLowerCase();

    if (!texto) {
      this.ingredientesFiltrados = [...this.ingredientes]; //  muestra todo
      return;
    }

    this.ingredientesFiltrados = this.ingredientes.filter(ing => {
      const nombre    = ing.nombre.toLowerCase();
      const alergenos = ing.alergenos?.toLowerCase() ?? '';
      return nombre.includes(texto) || alergenos.includes(texto);
    });
  }

  abrirModal(ingrediente?: IIngredientes) {
    this.ingrediente = ingrediente ? ingrediente : null;
    this.modalIngredienteAbierto = true;
  }

  cerrarModal() {
    this.modalIngredienteAbierto = false;
  }

  agregarActualizarIngrediente(ingrediente: IIngredientes) {
    if (ingrediente.id) {
      this.actualizarIngrediente(ingrediente);
    } else {
      this.agregarIngrediente(ingrediente);
    }
    this.cerrarModal();
  }

  async agregarIngrediente(ingrediente: IIngredientes) {
    try {
      await this.ingredientesService.createIngrediente(ingrediente);
      toast.success('Ingrediente agregado correctamente');
      this.init()
    } catch (error) {
      toast.error('Error al agregar ingrediente');
    }
  }

  async actualizarIngrediente(ingrediente: IIngredientes) {
    try {
      const ingredienteActualizado = { ...ingrediente, id: ingrediente.id };
      await this.ingredientesService.updateIngrediente(ingrediente.id, ingredienteActualizado);
      this.init()
      toast.success('Ingrediente actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar ingrediente');
    }
  }

  async delete(ingrediente: IIngredientes) {
    toast(`¿Deseas Borrar al Ingrediente ${ingrediente?.nombre}?`, {
      action: {
        label: 'Aceptar',
        onClick: () => this.deleteIngrediente(ingrediente.id),
      },
      duration: 6000,
    });
  }

  private async deleteIngrediente(id: number) {
    try {
      /* (opcional) desactiva UI: cambia bandera isDeleting = true … */
      await this.ingredientesService.deleteIngrediente(id);
      toast.success('Ingrediente eliminado con éxito');
      this.init()
    } catch (err) {
      console.error('Error al eliminar:', err);
      toast.error('Error al eliminar el ingrediente');
    }
  }
}
