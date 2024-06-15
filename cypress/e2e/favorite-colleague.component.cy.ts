describe('favorite-colleagues', () => {
  beforeEach(function () {
    cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
    cy.intercept('GET', '/api/v1/user', {fixture: 'authenticated.fixture.json'})

  })


  context('happy-flow', () => {
      beforeEach(function () {
        cy.intercept('GET', '/api/v1/user', {fixture: 'authenticated.fixture.json'})
        cy.intercept('GET', "/api/v1/user",
          {fixture: 'favorite-colleague-fixtures/get-users.fixture.json'}).as('getUsers');
        cy.intercept('GET', "/api/v1/user/favorite-colleagues",
          {fixture: 'favorite-colleague-fixtures/get-favorites.fixture.json'}).as('getFavorites');

        cy.visit('http://localhost:4200/#/favorites');
        cy.wait(500)
      })

    it('should navigate to favorites page', () => {
      cy.url().should('contain', '/favorites')
    })

    it('should fetch userdata on favorites page', () => {
      cy.wait(['@getUsers'])
        .then(([users]) => {
        expect(users.response?.statusCode).to.equal(200);

      });
    })

    it('should fetch favorite colleagues of user', () => {
      cy.wait(['@getFavorites'])
        .then(([favorites]) => {
          expect(favorites.response?.statusCode).to.equal(200);

        });
    })

  })
})
