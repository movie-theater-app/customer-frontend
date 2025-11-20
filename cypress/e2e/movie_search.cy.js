describe('Movie Search', () => {

  const baseUrl = 'http://localhost:5173'

  // Set default before each test
  beforeEach(() => {
    cy.visit(baseUrl + '/')
  })

  // Test 1: Tests if anything is loaded on main page
  it('Should open main page', () => {
    cy.get('img[src*="logo.png"]').should('be.visible')
    cy.contains('Trending').should('be.visible')
  })

  // Test 2: Tests if dropdown contains theaters
  it('Should display theaters in dropdown', () => {
    cy.get('span').contains('Multiple theaters selected').should('be.visible')
  })

  // Test 3: Tests movie search functionality with no filters
  it('Should search movies with no filters', () => {
    cy.get('button').contains('Search').click()
    cy.get('.movies-container').children().should('have.length.greaterThan', 0)
    cy.get('.no-results').should('not.exist')
  })

  // Test 4: Tests movie search functionality with movie name as filter, resulting in no movies found
  it('Should search movies with movie name as filter', () => {
    cy.get('input[placeholder="Search movies"]').type('Inception')
    cy.get('button').contains('Search').click()
    cy.get('.no-results').should('be.visible')
  })

  // Test 5: Tests movie search functionality with movie name as filter, resulting in movies found
  it('Should search movies with date filter resulting in movies found', () => {
    cy.get('.date-picker').click()
    cy.get('.rmdp-day').contains('14').click()
    cy.get('input[placeholder="Search movies"]').type('Spiderman')
    cy.get('button').contains('Search').click()
    cy.get('.movies-container').children().should('have.length.greaterThan', 0)
    cy.get('.no-results').should('not.exist')
  })

  // Test 6: Tests movie search functionality with theater filter resulting in no movies found
  it('Should search movies with theater filter resulting in no movies found', () => {
    cy.get('.date-picker').click()
    cy.get('.rmdp-day').contains('14').click()
    cy.get('.selection').click()
    cy.get('.dropdown-item').contains('Cinema Nova Oulu').click()
    cy.get('.selection').click()
    cy.get('input[placeholder="Search movies"]').type('Spiderman')
    cy.get('button').contains('Search').click()
    cy.get('.no-results').should('be.visible')
  })
  
  // Test 7: Tests movie search functionality with deselecting theaters and still finding movies
  it('Should search movies with theater filter resulting in movies found', () => {
    cy.get('.date-picker').click()
    cy.get('.rmdp-day').contains('14').click()
    cy.get('.selection').click()
    cy.get('.dropdown-item').contains('Kino Baltic Turku').click()
    cy.get('.dropdown-item').contains('Elokuvateatteri Helsinki Central').click()
    cy.get('.selection').click()
    cy.get('input[placeholder="Search movies"]').type('Spiderman')
    cy.get('button').contains('Search').click()
    cy.get('.movies-container').children().should('have.length.greaterThan', 0)
    cy.get('.no-results').should('not.exist')
  })

  // Test 8: Tests movie search functionality with date filter resulting in no movies found
  it('Should search movies with date filter resulting in no movies found', () => {
    cy.get('.date-picker').click()
    cy.get('.rmdp-day').contains('1').click()
    cy.get('button').contains('Search').click()
    cy.get('.no-results').should('be.visible')
  })

})