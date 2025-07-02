import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnosComponent } from './turnos.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TurnosComponent', () => {
  let component: TurnosComponent;
  let fixture: ComponentFixture<TurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have turnos with empleado_id, fecha, hora_inicio, hora_fin', () => {
    component.turnos = [
      { id: 1, empleado_id: 1, fecha: '2024-01-01', hora_inicio: '08:00', hora_fin: '16:00', estado: 'Asignado', dia: '', hora: 0, duracion: 0, titulo: '', roles_id: 1, color: '' }
    ];
    for (const turno of component.turnos) {
      expect(turno.empleado_id).toBeDefined();
      expect(turno.fecha).toBeDefined();
      expect(turno.hora_inicio).toBeDefined();
      expect(turno.hora_fin).toBeDefined();
    }
  });
});
