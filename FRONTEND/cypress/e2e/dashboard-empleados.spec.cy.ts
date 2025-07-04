/// <reference types="cypress" />

describe('Dashboard Empleados', () => {
  beforeEach(() => {
    cy.loginEmpleado();
    cy.visit('/dashboard');
  });

  it('debe mostrar el dashboard principal', () => {
    cy.contains('Panel de Control').should('be.visible');
  });
});
