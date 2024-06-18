describe('homepage', () => {
    beforeEach(function() {
      cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
      cy.intercept('GET', '/api/v1/auth/isAdmin', {fixture: 'is-admin.fixture.json'})
    })

    context('happy-flow', () => {
        it('should visit /home', () => {
            cy.visit('http://localhost:4200/#/home');
        
            cy.wait(500);
        
            cy.url().should('contain', '/home');
          })

        it('should display the homepage', () => {
            cy.visit('http://localhost:4200/#/home');
        
            cy.wait(500);
        
            cy.get('p').should('contain', 'Maak een nieuwe reservering');
          })

        it('should not have a default location', () => {
          cy.intercept('GET', 'api/v1/user/standard-location', {fixture: 'home-fixtures/no-default-location.fixture.json'})
            cy.visit('http://localhost:4200/#/home');
        
            cy.wait(500);
        
            cy.get('button').should('contain', 'Stel standaard locatie in');
          })

        it('should have a default location', () => {
            cy.intercept('GET', 'api/v1/user/standard-location', {fixture: 'home-fixtures/default-location.fixture.json'})
            cy.visit('http://localhost:4200/#/home');
        
            cy.wait(500);
        
            cy.get('h3').should('contain', 'Locatie: Arhem');
          }
        )

        it('should display the reservations', () => {
            cy.intercept('GET', 'api/v1/reservations/all', {fixture: 'home-fixtures/upcoming-reservations.fixture.json'})
            cy.visit('http://localhost:4200/#/home');
        
            cy.wait(500);
        
            cy.get('h2').should('contain', 'Aankomende reserveringen');

            cy.get('ul').should('have.length.greaterThan', 0);
          })
    })

    context('sad-flow', () => {
        it('should display an error message when the server is down', () => {
            cy.intercept('GET', 'api/v1/reservations/all', {statusCode: 500})
            cy.visit('http://localhost:4200/#/home');
        
            cy.wait(500);

            cy.get('.toast-error').should('be.visible');
            cy.get('.toast-error').should('contain.text', 'Fout bij het ophalen van reserveringen');
          })
    })
})