describe('favorite-colleagues', () => {
  beforeEach(function () {
    cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
    cy.intercept('GET', '/api/v1/user', {fixture: 'authenticated.fixture.json'})

  })


  context('happy-flow', () => {
    it('should navigate to favorites page', () => {
      cy.visit('http://localhost:4200/#/favorites');

      cy.wait(300)
    })
  })
})
