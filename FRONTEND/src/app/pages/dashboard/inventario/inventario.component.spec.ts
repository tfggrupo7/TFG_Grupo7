import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioComponent } from './inventario.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('InventarioComponent', () => {
  let component: InventarioComponent;
  let fixture: ComponentFixture<InventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioComponent, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(InventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ingredientes with estado and proveedor properties', () => {
    // Simula ingredientes
    component.ingredientes = [
      { id: 1, nombre: 'Tomate', categoria: 'Fruta', cantidad: '10', proveedor: 'Proveedor1', estado: 'Disponible', alergenos: '', unidad: 'kg', createdAt: '', updatedAt: '' },
      { id: 2, nombre: 'Lechuga', categoria: 'Verdura', cantidad: '5', proveedor: 'Proveedor2', estado: 'Agotado', alergenos: '', unidad: 'kg', createdAt: '', updatedAt: '' }
    ];
    for (const ingrediente of component.ingredientes) {
      expect(ingrediente.estado).toBeDefined();
      expect(ingrediente.proveedor).toBeDefined();
    }
  });
});
