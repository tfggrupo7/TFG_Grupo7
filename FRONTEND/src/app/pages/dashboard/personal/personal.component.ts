import { Component, inject } from '@angular/core';
import { IEmpleados } from '../../../interfaces/iempleados.interfaces';
import { EmpleadosService } from '../../../core/services/empleados.service';
import { toast } from 'ngx-sonner';
import { IRoles } from '../../../interfaces/iroles.interfaces';
import { RolesService } from '../../../core/services/roles.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ReactiveFormsModule, FormModalComponent],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent {
  arrEmpleados: IEmpleados[] = [];
  arrRoles: IRoles[] = [];
  empleadosFiltrados: IEmpleados[] = [];
  modalEmpleadoAbierto = false;
  modalUpdateEmpleadoAbierto = false;
  userForm: FormGroup = new FormGroup({});
  busqueda = new FormControl('');
  empleadoId!: number;
  isSubmitting = false;
  loaderService = inject(LoaderService);

  constructor(
    private empleadoService: EmpleadosService,
    private rolesService: RolesService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.cargarEmpleados();
    this.arrRoles = await this.rolesService.getRoles();

    const userId = this.getUserIdFromToken();

    this.userForm = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      rol_id: new FormControl(3, Validators.required), // Valor por defecto: Empleado
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fecha_inicio: new FormControl(this.getTodayDate(), Validators.required), // Valor por defecto: hoy
      salario: new FormControl('', Validators.required),
      usuario_id: new FormControl(userId),
      activo: new FormControl('Activo', Validators.required), // Valor por defecto
    });

    this.empleadosFiltrados = [];

    this.busqueda.valueChanges.subscribe((valor) => {
      this.filtrarEmpleados(valor || '');
    });
    this.busqueda.setValue(''); // Inicializar el campo de búsqueda vacío
  }

  filtrarEmpleados(valor: string) {
    const texto = valor.trim().toLowerCase();
    if (!texto) {
      this.empleadosFiltrados = []; // No mostrar ninguno si no hay búsqueda
      return;
    }
    this.empleadosFiltrados = this.arrEmpleados.filter((emp: IEmpleados) =>
      emp.nombre.toLowerCase().includes(texto)
    );
  }

  async cargarEmpleados() {
    try {
      const userId = Number(this.getUserIdFromToken());
      const empleados = await this.empleadoService.getEmpleados();
      this.arrEmpleados = empleados.filter(
        (emp: IEmpleados) => emp.usuario_id === userId
      );
    } catch (error: any) {
      toast.error(error?.error || 'Error al cargar empleados');
    }
  }

  getNombreRol(rol_id: number): string {
    const rol = this.arrRoles.find((r: IRoles) => r.id === rol_id);
    return rol ? rol.nombre : 'Sin rol';
  }

  get totalActivos(): number {
    return this.arrEmpleados.filter((e: IEmpleados) => e.activo).length;
  }

  get totalEnVacaciones(): number {
    return this.arrEmpleados.filter(
      (e: IEmpleados) => e.activo === 'VACACIONES'
    ).length;
  }

  get totalSalario(): number {
    return this.arrEmpleados.reduce(
      (total: number, empleado: IEmpleados) => total + Number(empleado.salario),
      0
    );
  }

  esActivo(empleado: IEmpleados): string {
    return empleado.activo ? 'ACTIVO' : 'INACTIVO';
  }

  esEnVacaciones(empleado: IEmpleados): string {
    return empleado.status === 'vacaciones' ? 'EN VACACIONES' : '';
  }

  abrirModal() {
    const userId = this.getUserIdFromToken();
    this.userForm.reset({
      id: null,
      nombre: '',
      apellidos: '',
      rol_id: 3, // Valor por defecto: Empleado
      telefono: '',
      email: '',
      fecha_inicio: this.getTodayDate(),
      salario: '',
      usuario_id: userId,
      activo: 'Activo',
    });
    this.modalEmpleadoAbierto = true;
    this.isSubmitting = false;
  }

  cerrarModal() {
    this.modalEmpleadoAbierto = false;
    this.userForm.reset();
    this.isSubmitting = false;
  }

  cerrarModalUpdate() {
    this.modalUpdateEmpleadoAbierto = false;
    this.userForm.reset();
    this.isSubmitting = false;
  }

  abrirModalUpdate(empleado: IEmpleados) {
    this.modalUpdateEmpleadoAbierto = true;
    this.empleadoId = empleado.id;
    this.userForm.patchValue({
      id: empleado.id,
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      rol_id: empleado.rol_id,
      telefono: empleado.telefono,
      email: empleado.email,
      fecha_inicio: empleado.fecha_inicio,
      salario: empleado.salario,
      usuario_id: empleado.usuario_id,
      activo: empleado.activo,
    });
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = token.split('.')[1];
    if (!payload) return null;
    try {
      const decoded = JSON.parse(atob(payload));
      return decoded.usuario_id || null;
    } catch (e) {
      return null;
    }
  }

  async getDataForm() {
    if (this.userForm.invalid) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    // Formatear fecha_inicio a YYYY-MM-DD
    const formValue = { ...this.userForm.value };
    if (formValue.fecha_inicio) {
      formValue.fecha_inicio = this.formatDateForMySQL(formValue.fecha_inicio);
    }
    try {
      await this.empleadoService.createEmpleado(formValue);
      toast.success('Empleado registrado correctamente');
      setTimeout(() => {
        this.router.navigate(['/dashboard', 'personal']).then(() => {
          window.location.reload();
          this.cerrarModal();
          this.isSubmitting = false;
        });
      }, 3000);
    } catch (error: any) {
      toast.error(error?.error || 'Fallo en el registro');
      this.isSubmitting = false;
    }
  }

  async updateDataForm() {
    if (this.userForm.invalid) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    const empleadoId = Number(this.empleadoId);
    if (!empleadoId || isNaN(empleadoId)) {
      toast.error('ID de empleado inválido');
      this.isSubmitting = false;
      return;
    }
    // Formatear fecha_inicio a YYYY-MM-DD
    const formValue = { ...this.userForm.value };
    if (formValue.fecha_inicio) {
      formValue.fecha_inicio = this.formatDateForMySQL(formValue.fecha_inicio);
    }
    try {
      const empleadoActualizado: IEmpleados = {
        ...formValue,
        id: empleadoId,
      };
      await this.empleadoService.updateEmpleado(empleadoActualizado);
      toast.success('Empleado Actualizado correctamente');
      this.router.navigate(['/dashboard', 'personal']).then(() => {
        setTimeout(() => {
          this.cargarEmpleados();
          this.cerrarModalUpdate();
          this.isSubmitting = false;
        }, 1000);
      });
    } catch (error) {
      toast.error('Fallo al actualizar el empleado');
      this.isSubmitting = false;
    }
  }

  // Utilidad para formatear fechas a YYYY-MM-DD
  formatDateForMySQL(date: string | Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  // Utilidad para obtener la fecha de hoy en formato YYYY-MM-DD
  getTodayDate(): string {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  async delete(id: number) {
    const empleado = this.arrEmpleados.find((e) => e.id === id);
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
        },
      },
    });
  }

  deleteEmpleado(id: number) {
    this.arrEmpleados = this.arrEmpleados.filter(
      (empleado) => empleado.id !== id
    );
    toast.success('Empleado eliminado con éxito');
  }
}
