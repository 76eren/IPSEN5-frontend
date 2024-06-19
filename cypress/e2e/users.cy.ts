describe('users', () => {
  beforeEach(function() {
    cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
    cy.intercept('GET', '/api/v1/user', {fixture: 'users/users.fixture.json'}).as('getUsers')
    cy.intercept('GET', '/api/v1/auth/isAdmin', {fixture: 'is-admin.fixture.json'})
    cy.visit('http://localhost:4200/#/users');
  })

  it('Should be able to reach the users page', () => {
    cy.url().should('contain', '/users');
  });

  it('Should fetch users', () => {
    cy.wait('@getUsers').then((users) => {
      expect(users.response?.statusCode).to.equal(200);
    });
  });


  it('Should display all users', () => {
    cy.get('li').should('have.length', 45);
  });

  it('Should be able to see filtered user', () => {
    cy.get('input').type('Eren de Koning');
    cy.contains('Eren de Koning').should('exist');
  });

  it('Should not be able to see not filtered user', () => {
    cy.get('input').type('Lara Croft');
    cy.contains('Eren de Koning').should('not.exist');
  });

})
