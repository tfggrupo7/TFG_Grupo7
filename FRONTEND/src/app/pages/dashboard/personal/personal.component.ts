import { Component, inject } from '@angular/core';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { toast } from 'ngx-sonner';
import { IRoles } from '../../../interfaces/iroles.interfaces';
import { RolesService } from '../../../core/services/roles.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';


@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  empleados: IEmpleados[]=[];
  arrEmpleados: IEmpleados []=[];
  currentPage: number = 1;
  totalPages: number = 1;
  arrRoles:IRoles[] = [];
  modalEmpleadoAbierto = false;
  modalUpdateEmpleadoAbierto = false;
  userForm: FormGroup = new FormGroup({},[]);
  empleadosFiltrados: IEmpleados[] = [];
  busqueda = new FormControl('');
  empleadoId!: number;
  loaderService = inject(LoaderService)

  constructor(private empleadoService: EmpleadosService, private rolesService: RolesService, private router: Router){}


  async ngOnInit() {
    this.cargarEmpleados();
    this.arrRoles = await this.rolesService.getRoles();


this.userForm = new FormGroup({
  id: new FormControl(null, []),
  nombre: new FormControl("", Validators.required),
  rol_id: new FormControl<number | null>(null, Validators.required),
  telefono: new FormControl("", [Validators.required, Validators.pattern('^[0-9]+$')]),
  email: new FormControl("", [Validators.required, Validators.email]),
  fecha_inicio: new FormControl("", Validators.required),
  salario: new FormControl("", Validators.required),
  activo: new FormControl("", Validators.required)
});


    this.empleados = await this.empleadoService.getEmpleados();
  this.empleadosFiltrados = this.empleados;

  this.busqueda.valueChanges.subscribe(valor => {
    this.filtrarEmpleados(valor ? valor : '');
  });
    this.busqueda.setValue(''); // Inicializar el campo de búsqueda vacío
    this.userForm.valueChanges.subscribe(value => {

    });
   }

// Filtrado de empleados en barra de búsqueda

   filtrarEmpleados(valor: string) {
   if (!Array.isArray(this.empleados)) {
    this.empleadosFiltrados = [];
    return;
  }
  const texto = (valor || '').toLowerCase();
  if (!texto) {
    // Si no hay texto de búsqueda, no mostramos nada
    this.empleadosFiltrados = [];
    return;
  }
  this.empleadosFiltrados = this.empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(texto) ||
    emp.email.toLowerCase().includes(texto)
  );
}
// Cargar empleados desde el servicio

  async cargarEmpleados() {
    try {
      this.arrEmpleados = await this.empleadoService.getEmpleados();
    } catch (error: any) {
      toast.error(error?.error || 'Error al cargar empleados');
    }
  }
  getNombreRol(rol_id: number): string {
    const rol = this.arrRoles.find(r => r.id === rol_id);
    return rol ? rol.nombre : 'Sin rol';
  }
  get totalActivos(): number {
  return this.arrEmpleados.filter(e => e.activo).length;
}
  get totalEnVacaciones(): number {
  return this.arrEmpleados.filter(e => e.status === 'vacaciones').length;
}
  get totalSalario(): number {
  return this.arrEmpleados.reduce((total, empleado) => total + Number(empleado.salario),0);
  }

// Funciones para mostrar el estado del empleado

esActivo(empleado: any): string {
  return empleado.activo ? 'ACTIVO' : 'INACTIVO';
}
  esEnVacaciones(empleado: any): string {
    return empleado.status === 'vacaciones' ? 'EN VACACIONES' : "";
  }


  /*async gotoNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.cargarEmpleados(this.currentPage);
    }
  }

  async gotoPrev() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.cargarEmpleados(this.currentPage);
    }
  }*/

// Funcionalidad de Modales

abrirModal() {
  this.modalEmpleadoAbierto = true;
}

cerrarModal() {
  this.modalEmpleadoAbierto = false;
}
cerrarModalUpdate() {
  this.modalUpdateEmpleadoAbierto = false;
}
abrirModalUpdate(empleado: IEmpleados) {
  this.modalUpdateEmpleadoAbierto = true;
  this.empleadoId = empleado.id;
  this.userForm.patchValue({
    id: empleado.id,
    nombre: empleado.nombre,
    rol_id: empleado.rol_id,
    telefono: empleado.telefono,
    email: empleado.email,
    fecha_inicio: empleado.fecha_inicio,
    salario: empleado.salario,
    activo: empleado.activo
  });
}

// CRUD Empleados

async getDataForm() {
  let response: IEmpleados | any;
  try {

    response = await this.empleadoService.createEmpleado(this.userForm.value);

    toast.success("Empleado registrado correctamente");
    setTimeout(() => {
      this.router.navigate(['/dashboard' , 'personal']).then(() => {
        window.location.reload();
        this.cerrarModal();
      });
    }, 3000);
  } catch (msg: any) {
    toast.error("Fallo en el registro");
  }
  if (this.userForm.invalid) {
  toast.error('Por favor, completa todos los campos obligatorios.');
  return;
  }
}

async updateDataForm() {
  let response: IEmpleados | any;
  try {
    const empleadoActualizado: IEmpleados = { ...this.userForm.value, id: this.empleadoId };
    response = await this.empleadoService.updateEmpleado(empleadoActualizado);
    toast.success("Empleado Actualizado correctamente");
    this.router.navigate(['/dashboard', 'personal']).then(() => {
      setTimeout(() => {
        window.location.reload();
        this.cerrarModalUpdate();
      }, 1000);
    });
  } catch (msg: any) {
    toast.error("Fallo al actualizar el empleado");
  }
  if (this.userForm.invalid) {
  toast.error('Por favor, completa todos los campos obligatorios.');
  return;
  }
}

async delete(id: number) {
  // Buscar el empleado por id para mostrar el nombre
  const empleado = this.arrEmpleados.find(e => e.id === id);
  const nombreEmpleado = empleado ? empleado.nombre : 'Empleado';

 toast(`¿Deseas Borrar al Empleado ${nombreEmpleado}?`, {
    action: {
      label: 'Aceptar',
      onClick: async () => {
        try {
          await this.empleadoService.deleteEmpleado(id);
          toast.success('Empleado eliminado con éxito', {
            duration: 2000
          });
          this.router.navigate(['/dashboard', 'personal']).then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });



        } catch (error: any) {
          console.log('Error al eliminar el usuario:', error);
          toast.error('Error al eliminar el usuario');
        }
      }
    }
  });
}
deleteEmpleado(id: number) {
  this.arrEmpleados = this.arrEmpleados.filter(empleado => empleado.id !== id);
  toast.success('Empleado eliminado con éxito');
}



}
