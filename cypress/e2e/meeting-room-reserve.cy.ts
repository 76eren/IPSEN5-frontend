describe('reserve-workplace', () => {
  beforeEach(function () {
    cy.intercept('GET', '/api/v1/auth/authenticated', {fixture: 'authenticated.fixture.json'})
    cy.intercept('GET', '/api/v1/auth/isAdmin', {fixture: 'is-admin.fixture.json'})
  })
  context('happy-flow', () => {
    describe('MeetingRoom Reservation', () => {
      beforeEach(() => {
        cy.intercept('GET', "/api/v1/building", {fixture: 'report-dashboard-fixtures/get-buildings.fixture.json'}).as('getBuildings');
        cy.intercept('GET', "/api/v1/location/available-rooms?buildingId=%E2%89%88&numberOfPeople=5&startDateTime=2024-07-01T07:00:00&endDateTime=2024-07-01T08:00:00", {fixture: 'get-available-rooms.fixture.json'}).as('getAvailableRooms');
        cy.visit('http://localhost:4200/#/create-reservation'); // Update this with the correct path to your component
      });
      it('should complete a workplace reservation', () => {
        // Step 1: Select a building
        cy.wait('@getBuildings');
        cy.get('h1').contains('Selecteer een Gebouw:').should('be.visible');
        cy.get('swiper-container').within(() => {

          cy.get('swiper-slide').first().click();
        });
        // Step 2: Select reservation type

        cy.get('button').contains('Lokaal').click();
        cy.get('button').contains('Volgende').click();

        // Step 3: Select Number of persons
        cy.get('h1').contains('Voer Aantal personen in:').should('be.visible');
        cy.get('mat-form-field').first().within(() => {
          cy.get('input').type("5");
        });

        cy.get('button').contains('Volgende').click({force: true});

        // Step 4: Select date and time
        cy.get('mat-form-field').contains('Selecteer datum');
        cy.get('input[matInput]').eq(1).type('07/01/2024');

        cy.get('h1').contains('Selecteer starttijd:').should('be.visible');
        cy.get('ngx-timepicker-field').first().within(() => {
          cy.get('input').first().clear().type('09', { force: true });
          cy.get('input').last().clear().type('00', { force: true });
        });

        cy.get('h1').contains('Selecteer eindtijd:').should('be.visible');
        cy.get('ngx-timepicker-field').last().within(() => {
          cy.get('input').first().clear().type('10', { force: true });
          cy.get('input').last().clear().type('00', { force: true });
        });

        cy.wait(500);

        cy.get('[data-cy=volgende-button]').click({ force: true , multiple: true});

        cy.get('app-meeting-room-unit').first().click().then(() => {
          cy.wait(500).then(() => {
            cy.get('[data-cy=volgende-button]').click({ force: true , multiple: true});
          });
        });
        // Step 5: Confirm reservation
        cy.wait(500).then(() => {
          cy.get('strong').should('contain', 'Amsterdam');
        });
        cy.get('h1').contains('Verdieping:').within(() => {
          cy.get('strong').should('contain', '0');
        });
        cy.get('h1').contains('Vleugel:').within(() => {
          cy.get('strong').should('contain', 'A');
        });
        cy.get('h1').contains('Vergaderruimte naam:').within(() => {
          cy.get('strong').should('contain', '0.A9');
        });
        cy.get('h1').contains('Aantal personen:').within(() => {
          cy.get('strong').should('contain', '5');
        });
        cy.get('h1').contains('Start Datum en Tijd:').within(() => {
          cy.get('strong').should('contain', '1/7/2024, 9:00');
        });
        cy.get('h1').contains('Eind Datum en Tijd:').within(() => {
          cy.get('strong').should('contain', '1/7/2024, 10:00');
        });
        cy.get('h1').contains('Reservering Type:').within(() => {
          cy.get('strong').should('contain', 'VERGADERRUIMTE');
        });
        cy.intercept('POST', '/api/v1/reservations/reserve-workplace', { fixture: 'save-reservation-success.fixture.json' }).as('saveReservation');

        cy.get('button').contains('Bevestig').click({force: true});
        cy.wait('@saveReservation');

        cy.url().should('eq', 'http://localhost:4200/#/create-reservation/success');
      });
    });

  })
})
