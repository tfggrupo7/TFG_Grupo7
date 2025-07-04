import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesComponent } from './reportes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReportesComponent', () => {
  let component: ReportesComponent;
  let fixture: ComponentFixture<ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have metrics with ingresos, ordenes, eficiencia, costos', () => {
    expect(component.metrics).toBeDefined();
    expect(component.metrics.ingresos).toBeDefined();
    expect(component.metrics.ordenes).toBeDefined();
    expect(component.metrics.eficiencia).toBeDefined();
    expect(component.metrics.costos).toBeDefined();
  });

  it('should have ventasPorDia with dia and valor properties', () => {
    for (const venta of component.ventasPorDia) {
      expect(venta.dia).toBeDefined();
      expect(venta.valor).toBeDefined();
    }
  });

});
