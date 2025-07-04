describe('ChefDesk E2E Tests', () => {
  it('Visits the landing page and checks main content', () => {
    cy.visit('/')
    cy.contains('ChefDesk')
    cy.contains('Gestión')
    cy.contains('para Cocinas')
    cy.contains('Modernas')
  })

  it('Should have navigation buttons', () => {
    cy.visit('/')
    cy.contains('Regístrate')
    cy.contains('Ver Demo')
  })

  it('Should display feature cards', () => {
    cy.visit('/')
    cy.contains('Inventario Inteligente')
    cy.contains('Todo lo que necesitas para tu cocina')
  })
})
