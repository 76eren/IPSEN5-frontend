describe('favorite-colleagues', () => {
    beforeEach(function () {
        cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
        cy.intercept('GET', '/api/v1/auth/isAdmin', {fixture: 'is-admin.fixture.json'})
        cy.intercept('GET', "/api/v1/user",
            {fixture: 'favorite-colleague-fixtures/get-users.fixture.json'}).as('getUsers');
        cy.intercept('GET', "/api/v1/user/favorite-colleagues",
            {fixture: 'favorite-colleague-fixtures/get-favorites.fixture.json'}).as('getFavorites');
    })


    context('happy-flow', () => {
        beforeEach(function () {
            cy.visit('http://localhost:4200/#/favorites');
            cy.wait(200)
        })

        it('should navigate to favorites page', () => {
            cy.url().should('contain', '/favorites')
        })

        it('should fetch userdata on favorites page', () => {
            cy.wait('@getUsers')
                .then((users) => {
                    expect(users.response?.statusCode).to.equal(200);
                });
            cy.get('#all-users-list').should('have.length.greaterThan', 0);
            cy.get('#all-users-list').each(($el) => {
                cy.wrap($el).should('not.be.empty');
            });

        })

        it('should fetch favorite colleagues of user', () => {
            cy.wait('@getFavorites')
                .then((favorites) => {
                    expect(favorites.response?.statusCode).to.equal(200);

                });
            cy.get('#list-all-favorites').should('have.length.greaterThan', 0);
            cy.get('#list-all-favorites').each(($el) => {
                cy.wrap($el).should('not.be.empty');
            });
        })

        it('should add selected user to favorites', () => {
            cy.intercept('POST', '/api/v1/user/favorite-colleagues').as('addFavorite');
            const userToFavoriteEmail = "user1@cgi.com";
            const userToFavoriteFirstName = "John";
            const userToFavoriteLastName = "Doe";

            cy.get('#all-colleagues').click();
            cy.wait(200)
            cy.get('li').should('have.length.greaterThan', 0);
            cy.get('li')
                .contains(userToFavoriteEmail)
                .parents('li')
                .find('#add-favorite')
                .click();

            cy.wait('@addFavorite').then((xhr) => {
                expect(xhr.response?.statusCode).to.equal(200);
            });

            cy.get('#favorite-colleagues').click();
            cy.get('.favorites-list')
                .contains(userToFavoriteFirstName)
                .and(userToFavoriteLastName)
                .should('be.visible');
        })

    })
})
