import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjustesComponent } from './ajustes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AjustesComponent', () => {
  let component: AjustesComponent;
  let fixture: ComponentFixture<AjustesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(AjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
