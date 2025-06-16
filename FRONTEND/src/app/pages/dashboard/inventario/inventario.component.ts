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

  ingredientesService = inject(IngredientesService)
  router = inject(Router)

  constructor() {}

  async ngOnInit() {
    await this.cargarIngredientes();


    this.searchTerm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1; // resetea a la primera página
      this.cargarIngredientes(); // pide de nuevo al servidor con search
    });

    this.searchTerm.setValue('');
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
    this.cargarIngredientes()
  }

  async agregarIngrediente(ingrediente: IIngredientes) {
    try {
      await this.ingredientesService.createIngrediente(ingrediente);
      toast.success('Ingrediente agregado correctamente');
    } catch (error) {
      toast.error('Error al agregar ingrediente');
    }
  }

  async actualizarIngrediente(ingrediente: IIngredientes) {
    try {
      const ingredienteActualizado = { ...ingrediente, id: ingrediente.id };
      await this.ingredientesService.updateIngrediente(ingrediente.id, ingredienteActualizado);
      toast.success('Ingrediente actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar ingrediente');
    }
  }

  async eliminarIngrediente(id: number) {
    const ingrediente = this.ingredientes.find((i) => i.id === id);
    const nombreIngrediente = ingrediente ? ingrediente.nombre : 'Ingrediente';

    toast(`¿Deseas eliminar ${nombreIngrediente}?`, {
      action: {
        label: 'Aceptar',
        onClick: async () => {
          try {
            await this.ingredientesService.deleteIngrediente(id);
            toast.success('Ingrediente eliminado con éxito');
          } catch (error) {
            toast.error('Error al eliminar ingrediente');
          }
        },
      },
    });
  }


  async delete(id: number) {
    const ingrediente = this.ingredientes.find((e) => e.id === id);
    const nombreIngrediente = ingrediente?.nombre ?? 'Ingrediente';

    toast(`¿Deseas Borrar al Ingrediente ${nombreIngrediente}?`, {
      action: {
        label: 'Aceptar',
        onClick: () => this.deleteIngrediente(id),
      },
      duration: 6000,
    });
  }

  private async deleteIngrediente(id: number) {
    try {
      /* (opcional) desactiva UI: cambia bandera isDeleting = true … */
      await this.ingredientesService.deleteIngrediente(id);

      // quita del array base
      this.ingredientes = this.ingredientes.filter((i) => i.id !== id);

      // vuelve a aplicar filtro actual
      this.filtrarIngredientes(this.searchTerm.value ?? '');

      toast.success('Ingrediente eliminado con éxito');
    } catch (err) {
      console.error('Error al eliminar:', err);
      toast.error('Error al eliminar el ingrediente');
    }
  }
}
