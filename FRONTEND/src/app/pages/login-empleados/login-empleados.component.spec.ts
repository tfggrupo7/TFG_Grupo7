import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginEmpleadosComponent } from './login-empleados.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginEmpleadosComponent', () => {
  let component: LoginEmpleadosComponent;
  let fixture: ComponentFixture<LoginEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginEmpleadosComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a loginForm with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should make email and password required', () => {
    const form = component.loginForm;
    form.setValue({ email: '', password: '' });
    expect(form.valid).toBeFalse();
    form.setValue({ email: 'test@email.com', password: '1234' });
    expect(form.valid).toBeTrue();
  });
});
