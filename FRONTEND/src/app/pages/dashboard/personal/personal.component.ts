import { Component, inject } from '@angular/core';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { toast } from 'ngx-sonner';
import { IRoles } from '../../../interfaces/iroles.interfaces';
import { RolesService } from '../../../core/services/roles.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


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
      console.log('Form changes:', value);
    });
   }
   

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



abrirModal() {
  this.modalEmpleadoAbierto = true;
}

cerrarModal() {
  this.modalEmpleadoAbierto = false;
}
async getDataForm() {
  let response: IEmpleados | any;
  try {
    
    response = await this.empleadoService.createEmpleado(this.userForm.value);
    
    toast.success("Empleado registrado correctamente");
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 3000); 
  } catch (msg: any) {
   
    toast.error("Fallo en el registro");
  }
}

async updateDataForm() {
  let response: IEmpleados | any;
  try {
    const empleadoActualizado: IEmpleados = { ...this.userForm.value, id: this.empleadoId };
    response = await this.empleadoService.updateEmpleado(empleadoActualizado);
    toast.success("Empleado Actualizado correctamente");
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 3000);
  } catch (msg: any) {
    toast.error("Fallo al actualizar el empleado");
  }
}

async delete(id: number) {
  // Buscar el empleado por id para mostrar el nombre
  const empleado = this.arrEmpleados.find(e => e.id === id);
  const nombreEmpleado = empleado ? empleado.nombre : 'Empleado';

  console.log(`Intentando borrar al empleado con id: ${id}, nombre: ${nombreEmpleado}`);

  toast(`¿Deseas Borrar al Empleado ${nombreEmpleado}?`, {
    action: {
      label: 'Aceptar',
      onClick: async () => {
        try {
          console.log(`Confirmado: eliminando empleado con id: ${id}`);
          await this.empleadoService.deleteEmpleado(id);
          toast.success('Empleado eliminado con éxito', {
            duration: 2000
          });
          console.log('Empleado eliminado correctamente');
          this.router.navigate(['/dashboard']);
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
