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
  roles:IRoles[] = [];
  modalEmpleadoAbierto = false;
  userForm: FormGroup = new FormGroup({},[]);
  empleadosFiltrados: IEmpleados[] = []; 
  busqueda = new FormControl('');
  
  constructor(private empleadoService: EmpleadosService, private rolesService: RolesService, private router: Router){}


  async ngOnInit() {
    this.cargarEmpleados();
    this.cargarRoles();

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
    console.log('Filtrando empleados con valor:', valor);
    if (!Array.isArray(this.empleados)) {
    this.empleadosFiltrados = [];
    return;
  }
    const texto = (valor || '').toLowerCase();
    if (!texto) {
      this.empleadosFiltrados = this.empleados;
      return;
    }
    this.empleadosFiltrados = this.empleados.filter(emp =>
      emp.nombre.toLowerCase().includes(texto) ||
      emp.email.toLowerCase().includes(texto)
      
    );
    
  }



  async cargarEmpleados(page: number = 1) {
    try {
      const response = await this.empleadoService.cargarEmpleados(page);
      if (response) {
        this.arrEmpleados = response.data;
        this.currentPage = response.page;
        
      }
    } catch (msg: any) {
      toast.error(msg.error || 'Error al cargar usuarios');
    }
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
async cargarRoles(): Promise<void> {
    try {
      this.roles = await this.rolesService.getRoles();
    } catch (error) {
      toast.error('Error al cargar roles');
    }
}

  empleadoYroles(empleado: IEmpleados): string {
    const roles = empleado.role.map(role => role.nombre).join(', ');
    return roles;
}
  
  async gotoNext() {
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
  }



abrirModal() {
  this.modalEmpleadoAbierto = true;
}

cerrarModal() {
  this.modalEmpleadoAbierto = false;
}
async getDataForm() {
  let response: IEmpleados | any;
  try {
    console.log('Form values:', this.userForm.value);
    response = await this.empleadoService.createEmpleado(this.userForm.value);
    console.log('API response:', response);
    toast.success("Usuario registrado correctamente");
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 3000); 
  } catch (msg: any) {
    console.log('Error:', msg);
    toast.error("El usuario que intentas editar no existe");
  }
}
}
