import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IIngredientes } from '../../../interfaces/iingredientes.interfaces';
import { IngredientesService } from '../../../core/services/ingredientes.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class InventarioComponent implements OnInit {
  ingredientes: IIngredientes[] = [];
  arrIngredientes: IIngredientes[] = [];
  ingredientesFiltrados: IIngredientes[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  modalIngredienteAbierto = false;
  modalUpdateIngredienteAbierto = false;

  ingredienteId!: number;
  searchTerm = new FormControl('');
  ingredienteForm: FormGroup = new FormGroup({}, []);

  constructor(private ingredientesService: IngredientesService, private router: Router) {}

  async ngOnInit() {
    await this.cargarIngredientes();

    this.ingredienteForm = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      alergenos: new FormControl('', Validators.required)
    });

    this.searchTerm.valueChanges.subscribe(valor => {
      this.filtrarIngredientes(valor ?? '');
    });

    this.searchTerm.setValue('');
  }

  async cargarIngredientes() {
    try {
      this.ingredientes = await this.ingredientesService.getIngredientes();
      this.ingredientesFiltrados = this.ingredientes;
    } catch (error: any) {
      toast.error(error?.error || 'Error al cargar ingredientes');
    }
  }

  filtrarIngredientes(valor: string) {
    const texto = valor.toLowerCase();
    if (!texto) {
      this.ingredientesFiltrados = [];
      return;
    }

    this.ingredientesFiltrados = this.ingredientes.filter(ing =>
      ing.nombre.toLowerCase().includes(texto) ||
      ing.alergenos.toLowerCase().includes(texto)
    );
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
    // Buscar el ingrediente por id para mostrar el nombre
    const ingrediente = this.ingredientes.find(e => e.id === id);
    const nombreIngrediente = ingrediente ? ingrediente.nombre : 'Ingrediente';

   toast(`¿Deseas Borrar al Ingrediente ${nombreIngrediente}?`, {
      action: {
        label: 'Aceptar',
        onClick: async () => {
          try {
            await this.ingredientesService.deleteIngrediente(id);
            toast.success('Ingrediente eliminado con éxito', {
              duration: 2000
            });
            this.router.navigate(['/dashboard', 'inventory']).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            });



          } catch (error: any) {
            console.log('Error al eliminar el ingrediente:', error);
            toast.error('Error al eliminar el ingrediente');
          }
        }
      }
    });
  }
  deleteIngrediente(id: number) {
    this.ingredientes = this.ingredientes.filter(ingrediente => ingrediente.id !== id);
    toast.success('Ingrediente eliminado con éxito');
  }
}
