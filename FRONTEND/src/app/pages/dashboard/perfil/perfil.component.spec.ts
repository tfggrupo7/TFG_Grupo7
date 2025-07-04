import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilComponent, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    
    // Spy on service method to prevent actual HTTP calls
    spyOn(component, 'loadCurrentUser').and.returnValue(Promise.resolve());
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have usuario with nombre, apellidos, email, contraseña', () => {
    expect(component.usuario).toBeDefined();
    expect(component.usuario.nombre).toBeDefined();
    expect(component.usuario.apellidos).toBeDefined();
    expect(component.usuario.email).toBeDefined();
    expect(component.usuario.contraseña).toBeDefined();
  });

});
