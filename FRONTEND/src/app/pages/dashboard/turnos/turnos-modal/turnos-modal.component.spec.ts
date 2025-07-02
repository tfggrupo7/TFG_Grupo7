import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnosModalComponent } from './turnos-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TurnosModalComponent', () => {
  let component: TurnosModalComponent;
  let fixture: ComponentFixture<TurnosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosModalComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TurnosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
