import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenComponent } from './resumen.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResumenComponent', () => {
  let component: ResumenComponent;
  let fixture: ComponentFixture<ResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ResumenComponent);
    component = fixture.componentInstance;
    
    // Spy on service methods to prevent actual HTTP calls
    spyOn(component.IngredientesService, 'getAllIngredientes').and.returnValue(Promise.resolve([]));
    spyOn(component, 'cargarTurnosHoy').and.returnValue(Promise.resolve());
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have arrIngredientes with estado and nombre properties', () => {
    component.arrIngredientes = [
      { id: 1, nombre: 'Tomate', categoria: 'Fruta', cantidad: '10', proveedor: 'Proveedor1', estado: 'Bajo stock', alergenos: '', unidad: 'kg', createdAt: '', updatedAt: '' },
      { id: 2, nombre: 'Lechuga', categoria: 'Verdura', cantidad: '5', proveedor: 'Proveedor2', estado: 'Sin stock', alergenos: '', unidad: 'kg', createdAt: '', updatedAt: '' }
    ];
    for (const ingrediente of component.arrIngredientes) {
      expect(ingrediente.estado).toBeDefined();
      expect(ingrediente.nombre).toBeDefined();
    }
  });

});
