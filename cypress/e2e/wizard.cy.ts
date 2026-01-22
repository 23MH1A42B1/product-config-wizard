describe('Product Configuration Wizard', () => {
  it('completes the wizard successfully', () => {
  cy.visit('http://localhost:5173');

  // Step 1
  cy.get('[data-cy=product-type-select]').select('Laptop');
  cy.get('[data-cy=next-button]').click();

  // Step 2
  cy.get('[data-cy=ram-input]').type('16GB');
  cy.get('[data-cy=next-button]').click();

  // Summary
  cy.get('[data-cy=summary-title]').should('be.visible');
  cy.contains('Laptop').should('exist');
  cy.contains('16GB').should('exist');
});

});
