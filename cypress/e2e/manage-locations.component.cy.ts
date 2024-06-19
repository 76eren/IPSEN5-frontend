describe('manage-locations', () => {
  beforeEach(function() {
    cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
    cy.intercept('GET', '/api/v1/auth/isAdmin', {fixture: 'is-admin.fixture.json'})
  })

  context('happy-flow', () => {
    beforeEach(function() {
      cy.intercept('GET', "/api/v1/building", {fixture: 'report-dashboard-fixtures/get-buildings.fixture.json'}).as('getBuildings');
      cy.intercept('GET', '/api/v1/location/admin?buildingName=Amsterdam', {fixture: 'manage-locations-fixtures/get-locations-by-building.fixture.json'}).as('getLocationsByBuilding')
      cy.intercept('GET', '/api/v1/building/7b527137-a259-4740-9fa5-f6a4810cc5e3/wing', {fixture: 'manage-locations-fixtures/get-wings-by-building.fixture.json'}).as('getWingsByBuilding')

      cy.visit('http://localhost:4200/#/manage/locations')
      cy.wait(500)
    })

    it('should visit /manage/locations', () => {
      cy.url().should('contain', '/manage/locations')
    })

    it('should fetch data when visiting page', () => {
      cy.wait(['@getBuildings', '@getLocationsByBuilding', '@getWingsByBuilding']).then(([buildings, locations, wings]) => {
        expect(buildings.response?.statusCode).to.equal(200);
        expect(locations.response?.statusCode).to.equal(200);
        expect(wings.response?.statusCode).to.equal(200);
      });
    })

    it('should save new location', () => {
      cy.intercept('POST', '/api/v1/location/create', {fixture: 'manage-locations-fixtures/save-location.fixture.json'}).as('saveLocation')

      cy.get('#createLocation').click();
      cy.get('#locationName').type('testLocation');
      cy.get('#locationType').select('ROOM');
      cy.get('#building').select('Amsterdam');
      cy.get('#wing').select('0.A');
      cy.get('#capacity').type('4');
      cy.get('#save').click();

      cy.get('.toast-success').should('be.visible');
      cy.get('.toast-success').should('contain.text', 'De nieuwe werkplek is opgeslagen')
    })

    it('should edit existing location', () => {
      cy.intercept('PUT', '/api/v1/location/6c3cdffb-dc3d-4f4b-8f64-415679f106b7/edit', {fixture: 'manage-locations-fixtures/edit-location.fixture.json'}).as('editLocation')

      cy.get('#editLocation').click();
      cy.get('#locationName').clear().type('testLocation');
      cy.get('#locationType').select('ROOM');
      cy.get('#wing').select('0.B');
      cy.get('#capacity').clear().type('4');
      cy.get('#save').click();

      cy.get('.toast-success').should('be.visible');
      cy.get('.toast-success').should('contain.text', 'De werkplek is opgeslagen')
    })

    it('should delete location', () => {
      cy.intercept('DELETE', '/api/v1/location/6c3cdffb-dc3d-4f4b-8f64-415679f106b7/delete', {fixture: 'manage-locations-fixtures/delete-location.fixture.json'}).as('deleteLocation')

      cy.get('#deleteButton').click();
      cy.get('#deleteConfirmation').click();

      cy.get('.toast-success').should('be.visible');
      cy.get('.toast-success').should('contain.text', 'De locatie is verwijderd')
    })
  })

  context('exception-flow when data cannot be fetched', () => {
    it('should show error when buildings cannot be fetched', () => {
      cy.intercept('GET', '/api/v1/location/admin?buildingName=Amsterdam', {fixture: 'manage-locations-fixtures/get-locations-by-building.fixture.json'}).as('getLocationsByBuilding')
      cy.intercept('GET', '/api/v1/building/7b527137-a259-4740-9fa5-f6a4810cc5e3/wing', {fixture: 'manage-locations-fixtures/get-wings-by-building.fixture.json'}).as('getWingsByBuilding')

      cy.visit('http://localhost:4200/#/manage/locations')
      cy.wait(500)

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Er is iets misgegaan bij het ophalen van de data')
    })

    it('should show error when locations cannot be fetched', () => {
      cy.intercept('GET', "/api/v1/building", {fixture: 'report-dashboard-fixtures/get-buildings.fixture.json'}).as('getBuildings');
      cy.intercept('GET', '/api/v1/building/7b527137-a259-4740-9fa5-f6a4810cc5e3/wing', {fixture: 'manage-locations-fixtures/get-wings-by-building.fixture.json'}).as('getWingsByBuilding')

      cy.visit('http://localhost:4200/#/manage/locations')
      cy.wait(500)

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Er is iets misgegaan bij het ophalen van de data')
    })

    it('should show error when wings cannot be fetched', () => {
      cy.intercept('GET', "/api/v1/building", {fixture: 'report-dashboard-fixtures/get-buildings.fixture.json'}).as('getBuildings');
      cy.intercept('GET', '/api/v1/location/admin?buildingName=Amsterdam', {fixture: 'manage-locations-fixtures/get-locations-by-building.fixture.json'}).as('getLocationsByBuilding')

      cy.visit('http://localhost:4200/#/manage/locations')
      cy.wait(500)

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Er is iets misgegaan bij het ophalen van de data')
    })
  })

  context('exception-flow for edit, create and delete', () => {
    beforeEach(function() {
      cy.intercept('GET', "/api/v1/building", {fixture: 'report-dashboard-fixtures/get-buildings.fixture.json'}).as('getBuildings');
      cy.intercept('GET', '/api/v1/location/admin?buildingName=Amsterdam', {fixture: 'manage-locations-fixtures/get-locations-by-building.fixture.json'}).as('getLocationsByBuilding')
      cy.intercept('GET', '/api/v1/building/7b527137-a259-4740-9fa5-f6a4810cc5e3/wing', {fixture: 'manage-locations-fixtures/get-wings-by-building.fixture.json'}).as('getWingsByBuilding')

      cy.visit('http://localhost:4200/#/manage/locations')
      cy.wait(500)
    })

    it('should show error when a new location cannot be saved', () => {
      cy.intercept('POST', '/api/v1/location/create', {statusCode: 400, fixture: 'manage-locations-fixtures/exception-fixtures/create-location-error.fixture.json'}).as('saveLocationError')

      cy.get('#createLocation').click();
      cy.get('#locationName').type('testLocation');
      cy.get('#locationType').select('ROOM');
      cy.get('#building').select('Amsterdam');
      cy.get('#wing').select('0.A');
      cy.get('#capacity').type('4');
      cy.get('#save').click();

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Er is iets misgegaan bij het opslaan van de werkplek')
    })

    it('should show error when location cannot be edited', () => {
      cy.intercept('PUT', '/api/v1/location/6c3cdffb-dc3d-4f4b-8f64-415679f106b7/edit', {statusCode: 400, fixture: 'manage-locations-fixtures/exception-fixtures/edit-location-error.fixture.json'})

      cy.get('#editLocation').click();
      cy.get('#locationName').clear().type('testLocation');
      cy.get('#locationType').select('ROOM');
      cy.get('#wing').select('0.B');
      cy.get('#capacity').clear().type('4');
      cy.get('#save').click();

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Er is iets misgegaan bij het opslaan van de werkplek')
    })

    it('should show error when location cannot be deleted', () => {
      cy.intercept('DELETE', '/api/v1/location/6c3cdffb-dc3d-4f4b-8f64-415679f106b7/delete', {statusCode: 400, fixture: 'manage-locations-fixtures/exception-fixtures/delete-location-error.fixture.json'})

      cy.get('#deleteButton').click();
      cy.get('#deleteConfirmation').click();

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Er is iets misgegaan bij het verwijderen van de werkplek')
    })

    it('should show error when not all formfields are filled in createmode', () => {
      cy.get('#createLocation').click();
      cy.get('#locationType').select('ROOM');
      cy.get('#building').select('Amsterdam');
      cy.get('#wing').select('0.A');
      cy.get('#capacity').type('4');
      cy.get('#save').click();

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Vul alle velden in')
    })

    it('should show error when not all formfields are filled in editmode', () => {
      cy.get('#editLocation').click();
      cy.get('#locationName').clear();
      cy.get('#locationType').select('ROOM');
      cy.get('#wing').select('0.B');
      cy.get('#capacity').clear().type('4');
      cy.get('#save').click();

      cy.get('.toast-error').should('be.visible');
      cy.get('.toast-error').should('contain.text', 'Vul alle velden in')
    })
  })
})