describe('Movie Page', () => {

  const baseUrl = 'http://localhost:5173'
  const testMovieId = 1

  beforeEach(() => {
    cy.visit(baseUrl + `/movie/${testMovieId}`)
    // 14th day for tests
    cy.get('.date-picker').click()
    cy.get('.rmdp-day').contains('14').click()
    // Wait for showtimes to load
    cy.get('.showtimes-container, .no-showtimes', { timeout: 10000 }).should('exist')
  })

  // Test 1: Check if movie page loads correctly
  it('Should load movie page with basic elements', () => {
    cy.get('img[src*="logo.png"]').should('be.visible')
    cy.get('.movie-title').should('be.visible')
    cy.get('.movie-description').should('be.visible')
  })

  // Test 2: Check if movie trailer is displayed with YouTube video
  it('Should display movie trailer with YouTube video if available', () => {
    cy.get('.movie-trailer').should('exist')
    cy.get('.movie-trailer iframe').should('exist')
    cy.get('.movie-trailer iframe').should('have.attr', 'src').and('include', 'youtube.com/embed')
  })

  // Test 3: Check if movie details are displayed
  it('Should display movie details', () => {
    cy.get('.movie-title').should('not.be.empty')
    cy.get('.movie-description').should('not.be.empty')
    cy.get('.movie-poster img').should('be.visible')
  })

  // Test 4: Check if filters are present
  it('Should display filters', () => {
    cy.get('.movie-page-filters').should('be.visible')
    cy.get('.selection').should('exist')
    cy.get('.date-picker').should('be.visible')
  })

  // Test 6: Check if showtimes section is displayed
  it('Should display available showtimes section', () => {
    cy.contains('Available Showtimes').should('be.visible')
  })

  // Test 7: Check if showtimes are grouped by theater
  it('Should display showtimes grouped by theater', () => {
    cy.get('.theater-group').should('have.length.greaterThan', 0)
    cy.get('.showtime-theater').should('be.visible')
    cy.get('.showtime-theater-address').should('be.visible')
  })

  // Test 8: Check if showtime cards are displayed
  it('Should display showtime cards with details', () => {
    cy.get('.showtime-card', { timeout: 10000 }).should('have.length.greaterThan', 0).and('be.visible')
    cy.get('.showtime-card').first().should('be.visible').within(() => {
      cy.get('.showtime-time').should('exist')
      cy.get('.showtime-auditorium').should('exist')
      cy.get('.showtime-start-time').should('exist')
    })
  })

  // Test 9: Check if theater dropdown is interactive
  it('Should be able to interact with theater dropdown', () => {
    cy.get('.selection .dropdown-header').click()
    cy.get('.dropdown', { timeout: 5000 }).should('be.visible')
    cy.get('.dropdown-item').should('have.length.greaterThan', 0)
    cy.get('.dropdown-item').first().find('input[type="checkbox"]').click()
    cy.get('.selection .dropdown-header').click()
    cy.get('.dropdown').should('not.exist')
    cy.get('.movie-showtimes').should('be.visible')
  })

  // Test 10: Check if filtering by date works
  it('Should filter showtimes by selected date', () => {
    cy.get('.date-picker').click()
    cy.get('.rmdp-day').contains('15').click()
    cy.wait(300)
    cy.get('.movie-showtimes').within(() => {
      cy.get('.showtimes-container, .no-showtimes').should('exist')
    })
  })

  // Test 11: Check if clicking showtime card navigates to seat map
  it('Should navigate to seat map when clicking a showtime card', () => {
    cy.get('.select-auditorium').first().should('be.visible').click()
    cy.url().should('include', '/seat-map/')
  })

  // Test 12: Check if back button works
  it('Should navigate back when clicking back button', () => {
    cy.get('.back-button').click()
    cy.url().should('not.include', `/movie/${testMovieId}`)
  })

  // Test 13: Check if no showtimes message appears
  it('Should display no showtimes message when no matches found', () => {
    cy.get('.date-picker').click()
    cy.get('.rmdp-day').contains('1').click()
    cy.wait(500)
    cy.get('.no-showtimes').should('be.visible')
  })

  // Test 14: Check if auditorium names are displayed correctly
  it('Should display auditorium names', () => {
    cy.get('.showtime-auditorium').first().should('not.contain', 'Auditorium undefined')
    cy.get('.showtime-auditorium').first().invoke('text').should('not.be.empty')
  })

})