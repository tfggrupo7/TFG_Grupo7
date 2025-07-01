import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IIngredientes } from '../../../interfaces/iingredientes.interfaces';
import { IngredientesService } from '../../../core/services/ingredientes.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { InventarioFormComponent } from "./inventario-form/inventario-form.component";
import { IInventarioResumen } from '../../../interfaces/iinventarioresumen.interface';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AuthService } from '../../../core/services/auth.service';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InventarioFormComponent, FormModalComponent],
})
export class InventarioComponent implements OnInit {
  ingredientes: IIngredientes[] = [];
  arrIngredientes: IIngredientes[] = [];
  ingredientesFiltrados: IIngredientes[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  sort = { campo: 'nombre', direccion: 'ASC' };
  fecha: Date = new Date();
  modalIngredienteAbierto = false;

  ingredienteId!: number;
  searchTerm = new FormControl('');

  totalItems = 0;
  ingrediente!: IIngredientes | null;
  summary!: IInventarioResumen;
  user: any;

  ingredientesService = inject(IngredientesService)
  authService = inject(AuthService)
  router = inject(Router)

  emptyFormGroup: FormGroup;

  constructor() {
    registerLocaleData(localeEs, 'es-ES');
    this.emptyFormGroup = new FormGroup({});
  }

  async ngOnInit() {
    this.user = this.authService.getCurrentUserIdFromToken()
    this.cargarResumen()
    this.searchTerm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1; // resetea a la primera página
      this.cargarIngredientes()
    });

    this.searchTerm.setValue('');
  }

  init() {
    this.cargarResumen()
    this.cargarIngredientes()
  }

  get userId(): string {
    return this.user?.id ?? this.user?.usuario_id;
  }

  get tipo(): string {
    return this.user.id ? 'empleado' : 'usuario'
  }
  
  async cargarResumen() {
    this.summary = await this.ingredientesService.getResumen(this.tipo,this.userId);
  }

  async cargarIngredientes() {
    const search = this.searchTerm.value ?? '';
    this.ingredientes = await this.ingredientesService.getIngredientes(
      this.currentPage, this.pageSize, search, this.sort.campo, this.sort.direccion, this.userId, this.tipo
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


  abrirModal(ingrediente?: IIngredientes) {
    this.ingrediente = ingrediente ?? null;
    this.modalIngredienteAbierto = true;
  }

  cerrarModal() {
    this.modalIngredienteAbierto = false;
  }

  agregarActualizarIngrediente(ingrediente: IIngredientes) {
    if(!this.user.role) {
      ingrediente.usuario_id = this.user.usuario_id
    }else {
      ingrediente.empleados_id = this.user.id
      
    }   
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
      toast.success('Ingrediente actualizado correctamente');
      this.init()
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

  async getDataOrderBy(orderBy: string) {
    if(this.sort.campo === orderBy){
      this.sort.direccion = this.sort.direccion === 'ASC' ? 'DESC' : 'ASC';
    }else {
      this.sort.campo = orderBy
      this.sort.direccion = 'ASC'
    }

    this.cargarIngredientes()
  }
}
