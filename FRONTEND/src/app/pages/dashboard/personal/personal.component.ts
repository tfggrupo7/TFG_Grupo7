import { Component } from '@angular/core';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { toast } from 'ngx-sonner';
import { IRoles } from '../../../interfaces/iroles.interfaces';
import { RolesService } from '../../../core/services/roles.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  userForm: FormGroup;
  busqueda = new FormControl('');
  empleadoId!: number;

  constructor(
    private empleadoService: EmpleadosService,
    private rolesService: RolesService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      rol_id: new FormControl<number | null>(null, Validators.required),
      telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fecha_inicio: new FormControl('', Validators.required),
      salario: new FormControl('', Validators.required),
      activo: new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    await this.cargarEmpleados();
    this.arrRoles = await this.rolesService.getRoles();
    this.empleadosFiltrados = [...this.arrEmpleados];

    this.busqueda.valueChanges.subscribe(valor => {
      this.filtrarEmpleados(valor || '');
    });
    this.busqueda.setValue('');
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
    return this.arrEmpleados.reduce((total, empleado) => total + Number(empleado.salario), 0);
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
      await this.empleadoService.updateEmpleado(empleadoActualizado);
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
            console.log('Error al eliminar el usuario:', error);
            toast.error('Error al eliminar el usuario');
          }
        }
      }
    });
  }
}