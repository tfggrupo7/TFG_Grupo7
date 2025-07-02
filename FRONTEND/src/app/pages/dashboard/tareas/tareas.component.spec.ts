import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TareasComponent } from './tareas.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TareasComponent', () => {
  let component: TareasComponent;
  let fixture: ComponentFixture<TareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have tareas with titulo, descripcion, estado, empleado_id', () => {
    component.tareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Desc', fecha_inicio: '2024-01-01', fecha_finalizacion: '2024-01-02', hora_inicio: '10:00', hora_finalizacion: '12:00', estado: 'Pendiente', empleado_id: 1 }
    ];
    for (const tarea of component.tareas) {
      expect(tarea.titulo).toBeDefined();
      expect(tarea.descripcion).toBeDefined();
      expect(tarea.estado).toBeDefined();
      expect(tarea.empleado_id).toBeDefined();
    }
  });

  it('debería tener el flag isSubmitting definido', () => {
    expect(component.isSubmitting).toBeDefined();
  });
});
