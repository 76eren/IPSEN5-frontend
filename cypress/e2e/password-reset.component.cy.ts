describe('password-reset', () => {
  beforeEach(function () {

  })

  context('happy-flow', () => {
    beforeEach(function () {

    })

    it('should navigate to request resetlink page', () => {
      cy.visit('http://localhost:4200/#/login');

      cy.get('a').click()
      cy.wait(300)

      cy.url().should('contain', '/reset-password')
    })

    it('should request a resetlink', () => {
      cy.intercept('POST', "/api/v1/user/reset-password").as('requestReset')

      cy.visit('http://localhost:4200/#/reset-password');

      cy.get('input').type('cypress@cgi.com')
      cy.get('button').click()

      cy.wait('@requestReset').then((intercept) => {
        expect(intercept.response?.statusCode).to.equal(undefined);
      })
      cy.wait(300)

      cy.get('.toast-info').should('be.visible');
    })
  })

})
