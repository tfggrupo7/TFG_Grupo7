import { Component } from '@angular/core';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { toast } from 'ngx-sonner';
import { IRoles } from '../../../interfaces/iroles.interfaces';
import { RolesService } from '../../../core/services/roles.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { LoaderService } from '../../../core/services/loader.service';

=======
import { AuthService } from '../../../core/services/auth.service';
>>>>>>> optimizacioncodigopersonal

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  arrEmpleados: IEmpleados[] = [];
  arrRoles: IRoles[] = [];
  empleadosFiltrados: IEmpleados[] = [];
  modalEmpleadoAbierto = false;
  modalUpdateEmpleadoAbierto = false;
<<<<<<< HEAD
  userForm: FormGroup = new FormGroup({},[]);
  empleadosFiltrados: IEmpleados[] = [];
  busqueda = new FormControl('');
  empleadoId!: number;
  loaderService = inject(LoaderService)

  constructor(private empleadoService: EmpleadosService, private rolesService: RolesService, private router: Router){}
=======
  userForm!: FormGroup;
  busqueda = new FormControl('');
  empleadoId!: number;
>>>>>>> optimizacioncodigopersonal

  constructor(
    private empleadoService: EmpleadosService,
    private rolesService: RolesService,
    private router: Router,
    private authService: AuthService
  ) {}

<<<<<<< HEAD
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
=======
async ngOnInit() {
  await this.cargarEmpleados();
  this.arrRoles = await this.rolesService.getRoles();
  this.empleadosFiltrados = [...this.arrEmpleados];
>>>>>>> optimizacioncodigopersonal

  this.busqueda.valueChanges.subscribe(valor => {
    this.filtrarEmpleados(valor || '');
  });
<<<<<<< HEAD
    this.busqueda.setValue(''); // Inicializar el campo de búsqueda vacío
    this.userForm.valueChanges.subscribe(value => {

    });
   }

// Filtrado de empleados en barra de búsqueda
=======
  this.busqueda.setValue('');
>>>>>>> optimizacioncodigopersonal

const userId = this.getUserIdFromToken();
const token = localStorage.getItem('token');
if (token) {
  const payload = token.split('.')[1];
  console.log(JSON.parse(atob(payload)));
} else {
  toast.error('No token found in localStorage.');
}
  // Inicializar el formulario con los campos necesarios
  this.userForm = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    rol_id: new FormControl<number | null>(null, Validators.required),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    fecha_inicio: new FormControl('', Validators.required),
    salario: new FormControl('', Validators.required),
    usuario_id: new FormControl(userId),
    activo: new FormControl('', Validators.required)
  });

<<<<<<< HEAD
  async cargarEmpleados() {
    try {
      this.arrEmpleados = await this.empleadoService.getEmpleados();
    } catch (error: any) {
      toast.error(error?.error || 'Error al cargar empleados');
    }
=======

}
async ngOnSubmit() {
 
  try {
    await this.empleadoService.createEmpleado(this.userForm.value);
    // Puedes agregar lógica adicional aquí si es necesario
  } catch (err: unknown) {
    console.error('Error en el backend:', err);
>>>>>>> optimizacioncodigopersonal
  }
}


  // Filtrado de empleados en barra de búsqueda
  filtrarEmpleados(valor: string) {
    const texto = valor.toLowerCase();
    if (!texto) {
      this.empleadosFiltrados = [];
      return;
    }
    this.empleadosFiltrados = this.arrEmpleados.filter(emp =>
      emp.nombre.toLowerCase().includes(texto) ||
      emp.email.toLowerCase().includes(texto)
    );
  }

  // Cargar empleados desde el servicio
  async cargarEmpleados() {
  try {
    const userId = this.getUserIdFromToken();
    const empleados = await this.empleadoService.getEmpleados();
    this.arrEmpleados = empleados.filter((emp: any) => emp.usuario_id === userId);
  }catch (error: any) {
    toast.error(error?.error || 'Error al cargar empleados');
  }
  }

  getNombreRol(rol_id: number): string {
    const rol = this.arrRoles.find(r => r.id === rol_id);
    return rol ? rol.nombre : 'Sin rol';
  }

  get totalActivos(): number {
    const activos = this.arrEmpleados.filter(e => e.activo);
    
    return activos.length;
  }

  get totalEnVacaciones(): number {
    const enVacaciones = this.arrEmpleados.filter(e => e.status === 'vacaciones');
    
    return enVacaciones.length;
  }

  get totalSalario(): number {
    const total = this.arrEmpleados.reduce((total, empleado) => total + Number(empleado.salario), 0);
    
    return total;
  }

  // Funciones para mostrar el estado del empleado
  esActivo(empleado: IEmpleados): string {
    return empleado.activo ? 'ACTIVO' : 'INACTIVO';
  }

  esEnVacaciones(empleado: IEmpleados): string {
    return empleado.status === 'vacaciones' ? 'EN VACACIONES' : '';
  }

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
    this.userForm.patchValue({ ...empleado });
  }

  // Método para obtener el usuario ID actual desde el token
  getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const decoded = JSON.parse(atob(payload));
    return  decoded.usuario_id || null; // Ajusta según cómo venga el id en tu token
  } catch (e) {
    return null;
  }
}

  // CRUD Empleados
  async getDataForm() {
    if (this.userForm.invalid) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      await this.empleadoService.createEmpleado(this.userForm.value);
      toast.success('Empleado registrado correctamente');
      setTimeout(() => {
        this.router.navigate(['/dashboard', 'personal']).then(() => {
          window.location.reload();
          this.cerrarModal();
        });
      }, 3000);
    } catch {
      toast.error('Fallo en el registro');
    }
   
  }

  async updateDataForm() {
    if (this.userForm.invalid) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      const empleadoActualizado: IEmpleados = { ...this.userForm.value, id: this.empleadoId };
    
      await this.empleadoService.updateEmpleadoPerfil(empleadoActualizado);
      toast.success('Empleado Actualizado correctamente');
      this.router.navigate(['/dashboard', 'personal']).then(() => {
        setTimeout(() => {
          window.location.reload();
          this.cerrarModalUpdate();
        }, 1000);
      });
    } catch {
      toast.error('Fallo al actualizar el empleado');
    }
  }

  async delete(id: number) {
    const empleado = this.arrEmpleados.find(e => e.id === id);
    const nombreEmpleado = empleado ? empleado.nombre : 'Empleado';

    toast(`¿Deseas Borrar al Empleado ${nombreEmpleado}?`, {
      action: {
        label: 'Aceptar',
        onClick: async () => {
          try {
            await this.empleadoService.deleteEmpleado(id);
            toast.success('Empleado eliminado con éxito', { duration: 2000 });
            this.router.navigate(['/dashboard', 'personal']).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            });
          } catch (error: any) {
            
            toast.error('Error al eliminar el usuario');
          }
        }
      }
    });
  }
<<<<<<< HEAD


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
=======
 
  

}
>>>>>>> optimizacioncodigopersonal
