describe('login', () => {
  beforeEach(function() {
    cy.visit('http://localhost:4200/#/login');
  })

  it('should display validation error with empty inputs', () => {
    cy.get('button[type="submit"]').click();
    cy.wait(500);

    cy.get('div[role="alert"].toast-message')
      .should('be.visible')
      .and('contain', 'Er is iets misgegaan bij het inloggen. Probeer het opnieuw.');
  });


})
