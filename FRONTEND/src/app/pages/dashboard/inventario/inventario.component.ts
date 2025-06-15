import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IIngredientes } from '../../../interfaces/iingredientes.interfaces';
import { IngredientesService } from '../../../core/services/ingredientes.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class InventarioComponent implements OnInit {
  ingredientes: IIngredientes[] = [];
  arrIngredientes: IIngredientes[] = [];
  ingredientesFiltrados: IIngredientes[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  modalIngredienteAbierto = false;
  modalUpdateIngredienteAbierto = false;

  ingredienteId!: number;
  searchTerm = new FormControl('');
  ingredienteForm: FormGroup = new FormGroup({}, []);

  totalItems = 0;

  constructor(private ingredientesService: IngredientesService, private router: Router) {}

  async ngOnInit() {
    await this.cargarIngredientes();

    this.ingredienteForm = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      alergenos: new FormControl('', Validators.required)
    });

    this.searchTerm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.currentPage = 1;      // resetea a la primera página
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


  abrirModal() {
    this.modalIngredienteAbierto = true;
  }

  cerrarModal() {
    this.modalIngredienteAbierto = false;
  }

  cerrarModalUpdate() {
    this.modalUpdateIngredienteAbierto = false;
  }

  abrirModalUpdate(ingrediente: IIngredientes) {
    this.modalUpdateIngredienteAbierto = true;
    this.ingredienteId = ingrediente.id;
    this.ingredienteForm.patchValue(ingrediente);
  }

  async agregarIngrediente() {
    if (this.ingredienteForm.invalid) {
      toast.error('Completa todos los campos obligatorios.');
      return;
    }

    try {
      await this.ingredientesService.createIngrediente(this.ingredienteForm.value);
      toast.success("Ingrediente agregado correctamente");
      this.router.navigate(['/dashboard', 'ingredientes']).then(() => {
        window.location.reload();
        this.cerrarModal();
      });
    } catch (error) {
      toast.error("Error al agregar ingrediente");
    }
  }

  async actualizarIngrediente() {
    if (this.ingredienteForm.invalid) {
      toast.error('Completa todos los campos obligatorios.');
      return;
    }

    try {
      const ingredienteActualizado = { ...this.ingredienteForm.value, id: this.ingredienteId };
      await this.ingredientesService.updateIngrediente(this.ingredienteId, ingredienteActualizado);
      toast.success("Ingrediente actualizado correctamente");
      this.router.navigate(['/dashboard', 'ingredientes']).then(() => {
        window.location.reload();
        this.cerrarModalUpdate();
      });
    } catch (error) {
      toast.error("Error al actualizar ingrediente");
    }
  }

  async eliminarIngrediente(id: number) {
    const ingrediente = this.ingredientes.find(i => i.id === id);
    const nombreIngrediente = ingrediente ? ingrediente.nombre : 'Ingrediente';

    toast(`¿Deseas eliminar ${nombreIngrediente}?`, {
      action: {
        label: 'Aceptar',
        onClick: async () => {
          try {
            await this.ingredientesService.deleteIngrediente(id);
            toast.success("Ingrediente eliminado con éxito");
            this.router.navigate(['/dashboard', 'ingredientes']).then(() => {
              window.location.reload();
            });
          } catch (error) {
            toast.error("Error al eliminar ingrediente");
          }
        }
      }
    });
  }

  // CRUD Ingredientes

  async getDataForm() {
    let response: IIngredientes | any;
    try {

      response = await this.ingredientesService.createIngrediente(
        this.ingredienteForm.value
      );

      toast.success("Ingrediente registrado correctamente");
      setTimeout(() => {
        this.router.navigate(['/dashboard' , 'inventory']).then(() => {
          window.location.reload();
          this.cerrarModal();
        });
      }, 3000);
    } catch (msg: any) {
      toast.error("Fallo en el registro");
    }
    if (this.ingredienteForm.invalid) {
    toast.error('Por favor, completa todos los campos obligatorios.');
    return;
    }
  }

  async updateDataForm() {
    let response: IIngredientes | any;
    try {
      const ingredienteActualizado: IIngredientes = { ...this.ingredienteForm.value, id: this.ingredienteId };
      response = await this.ingredientesService.updateIngrediente(this.ingredienteId, ingredienteActualizado);
      toast.success("Ingrediente Actualizado correctamente");
      this.router.navigate(['/dashboard', 'ingrediente']).then(() => {
        setTimeout(() => {
          window.location.reload();
          this.cerrarModalUpdate();
        }, 1000);
      });
    } catch (msg: any) {
      toast.error("Fallo al actualizar el ingrediente");
    }
    if (this.ingredienteForm.invalid) {
    toast.error('Por favor, completa todos los campos obligatorios.');
    return;
    }
  }

  async delete(id: number) {
    const ingrediente = this.ingredientes.find(e => e.id === id);
    const nombreIngrediente = ingrediente?.nombre ?? 'Ingrediente';

    toast(`¿Deseas Borrar al Ingrediente ${nombreIngrediente}?`, {
      action: {
        label: 'Aceptar',
        onClick: () => this.deleteIngrediente(id)
      },
      duration: 6000
    });
  }

  private async deleteIngrediente(id: number) {
    try {
      /* (opcional) desactiva UI: cambia bandera isDeleting = true … */
      await this.ingredientesService.deleteIngrediente(id);

      // quita del array base
      this.ingredientes = this.ingredientes.filter(i => i.id !== id);

      // vuelve a aplicar filtro actual
      this.filtrarIngredientes(this.searchTerm.value ?? '');

      toast.success('Ingrediente eliminado con éxito');
    } catch (err) {
      console.error('Error al eliminar:', err);
      toast.error('Error al eliminar el ingrediente');
    }
  }




}
