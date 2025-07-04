import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioFormComponent } from './inventario-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InventarioFormComponent', () => {
  let component: InventarioFormComponent;
  let fixture: ComponentFixture<InventarioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(InventarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
