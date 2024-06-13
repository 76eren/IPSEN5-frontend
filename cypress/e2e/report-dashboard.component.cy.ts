describe('report-dashboard', () => {
  beforeEach(function() {
    cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
    cy.intercept('GET', '/api/v1/auth/isAdmin', {fixture: 'is-admin.fixture.json'})
  })

  context('happy-flow', () => {
    beforeEach(function() {
      cy.intercept('GET', "/api/v1/building", {fixture: 'report-dashboard-fixtures/get-buildings.fixture.json'}).as('getBuildings');
      cy.intercept('GET', '/api/v1/reports/occupancy?buildingName=Amsterdam&year=2024', {fixture: 'report-dashboard-fixtures/get-room-occupancy.fixture.json'}).as('getOccupancy');
      cy.intercept('GET', '/api/v1/reports/noshow?buildingName=Amsterdam&year=2024', {fixture: 'report-dashboard-fixtures/get-noshow.fixture.json'}).as('getNoshow');
    })

    it('should visit /reports', () => {
      cy.visit('http://localhost:4200/#/reports');
  
      cy.wait(500);
  
      cy.url().should('contain', '/reports');
    })
  
    it('should fetch data when visiting page', () => {
      cy.visit('http://localhost:4200/#/reports');
      
      cy.wait(['@getBuildings', '@getOccupancy', '@getNoshow']).then(([buildings, occupancy, noshow]) => {
        expect(buildings.response?.statusCode).to.equal(200);
        expect(occupancy.response?.statusCode).to.equal(200);
        expect(noshow.response?.statusCode).to.equal(200);
      });
    })
  
    it('should fetch data when selecting building', () => {
      cy.intercept('GET', '/api/v1/reports/occupancy?buildingName=Rotterdam&year=2024', {fixture: 'report-dashboard-fixtures/get-room-occupancy.fixture.json'}).as('getOccupancy');
      cy.intercept('GET', '/api/v1/reports/noshow?buildingName=Rotterdam&year=2024', {fixture: 'report-dashboard-fixtures/get-noshow.fixture.json'}).as('getNoshow');
  
      cy.visit('http://localhost:4200/#/reports');
  
      cy.wait(500)
  
      const selectedBuilding = 'Rotterdam';
      cy.get('#building').select(selectedBuilding);
      cy.get('#building').should('contain', selectedBuilding);
  
      cy.wait(['@getOccupancy', '@getNoshow']).then(([occupancy, noshow]) => {
        expect(occupancy.response?.statusCode).to.equal(200);
        expect(noshow.response?.statusCode).to.equal(200);
      });
    })
  
    it('should fetch data when selecting year', () => {
      cy.intercept('GET', '/api/v1/reports/occupancy?buildingName=Amsterdam&year=2023', {fixture: 'report-dashboard-fixtures/get-room-occupancy.fixture.json'}).as('getOccupancy');
      cy.intercept('GET', '/api/v1/reports/noshow?buildingName=Amsterdam&year=2023', {fixture: 'report-dashboard-fixtures/get-noshow.fixture.json'}).as('getNoshow');
  
      cy.visit('http://localhost:4200/#/reports');
  
      cy.wait(500)
  
      const selectedYear = '2023'
      cy.get('#year').select(selectedYear);
      cy.get('#year').should('contain', selectedYear);
  
      cy.wait(['@getOccupancy', '@getNoshow']).then(([occupancy, noshow]) => {
        expect(occupancy.response?.statusCode).to.equal(200);
        expect(noshow.response?.statusCode).to.equal(200);
      });
    })
  })

  context('exception-flow', () => {
    it('shows error popup when data fetching fails', () => {
      cy.visit('http://localhost:4200/#/reports');
      
      cy.wait(300)

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Er is iets misgegaan bij het ophalen van de data')
    })
  })
})