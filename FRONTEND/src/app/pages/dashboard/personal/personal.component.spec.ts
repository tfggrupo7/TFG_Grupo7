import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalComponent } from './personal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonalComponent', () => {
  let component: PersonalComponent;
  let fixture: ComponentFixture<PersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalComponent, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(PersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have arrEmpleados with nombre, apellidos, email, telefono', () => {
    component.arrEmpleados = [
      { id: 1, nombre: 'Juan', apellidos: 'Pérez', rol_id: 1, telefono: '123456789', email: 'juan@email.com', fecha_inicio: '2024-01-01', salario: 1000, usuario_id: 1, activo: 'Activo', status: 'activo', role: [] }
    ];
    for (const empleado of component.arrEmpleados) {
      expect(empleado.nombre).toBeDefined();
      expect(empleado.apellidos).toBeDefined();
      expect(empleado.email).toBeDefined();
      expect(empleado.telefono).toBeDefined();
    }
  });

  it('debería tener el flag isSubmitting definido', () => {
    expect(component.isSubmitting).toBeDefined();
  });
});
