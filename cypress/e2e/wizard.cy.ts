describe('Product Configuration Wizard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('shows Step 1 on initial load', () => {
    cy.get('[data-cy=step1-container]').should('be.visible');
    cy.get('[data-cy=step1-title]').should('contain.text', 'Select Product');
    cy.get('[data-cy=progress-indicator]').should('exist');
  });

  it('Next button is disabled until a product is selected', () => {
    cy.get('[data-cy=next-button]').should('be.disabled');
    cy.get('[data-cy=product-type-select]').select('Laptop');
    cy.get('[data-cy=next-button]').should('not.be.disabled');
  });

  it('advances from Step 1 to Step 2 after selecting a product', () => {
    cy.get('[data-cy=product-type-select]').select('Laptop');
    cy.get('[data-cy=next-button]').click();
    cy.get('[data-cy=step2-container]').should('be.visible');
    cy.get('[data-cy=step2-title]').should('contain.text', 'Configure Options');
  });

  it('goes back from Step 2 to Step 1', () => {
    cy.get('[data-cy=product-type-select]').select('Laptop');
    cy.get('[data-cy=next-button]').click();
    cy.get('[data-cy=back-button]').click();
    cy.get('[data-cy=step1-container]').should('be.visible');
  });

  it('Next button is disabled in Step 2 until RAM is entered', () => {
    cy.get('[data-cy=product-type-select]').select('Laptop');
    cy.get('[data-cy=next-button]').click();
    cy.get('[data-cy=next-button]').should('be.disabled');
    cy.get('[data-cy=ram-input]').type('16GB');
    cy.get('[data-cy=next-button]').should('not.be.disabled');
  });

  it('advances from Step 2 to Summary', () => {
    cy.get('[data-cy=product-type-select]').select('Laptop');
    cy.get('[data-cy=next-button]').click();
    cy.get('[data-cy=ram-input]').type('16GB');
    cy.get('[data-cy=next-button]').click();
    cy.get('[data-cy=summary-title]').should('be.visible');
  });

  it('shows selected values in the Summary', () => {
    cy.get('[data-cy=product-type-select]').select('Laptop');
    cy.get('[data-cy=next-button]').click();
    cy.get('[data-cy=ram-input]').type('16GB');
    cy.get('[data-cy=next-button]').click();
    cy.get('[data-cy=summary-productType]').should('contain.text', 'Laptop');
    cy.get('[data-cy=summary-ram]').should('contain.text', '16GB');
  });

  it('completes the wizard successfully end-to-end', () => {
    cy.get('[data-cy=product-type-select]').select('Laptop');
    cy.get('[data-cy=next-button]').click();

    cy.get('[data-cy=ram-input]').type('16GB');
    cy.get('[data-cy=next-button]').click();

    cy.get('[data-cy=summary-title]').should('be.visible');
    cy.contains('Laptop').should('exist');
    cy.contains('16GB').should('exist');
  });
});