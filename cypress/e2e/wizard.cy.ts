describe('Product Configuration Wizard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  describe('Step 1 - Product Selection', () => {
    it('displays the step 1 title and progress indicator', () => {
      cy.get('[data-cy=step1-title]').should('be.visible');
      cy.get('[data-cy=progress-indicator]').should('be.visible');
      cy.get('.progress-step.active').should('contain', 'Product');
    });

    it('disables next button when no product is selected', () => {
      cy.get('[data-cy=next-button]').should('be.disabled');
      cy.get('[data-cy=step1-title]').should('be.visible');
    });

    it('enables next button after selecting a product and navigates forward', () => {
      cy.get('[data-cy=next-button]').should('be.disabled');
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').should('not.be.disabled');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=step2-title]').should('be.visible');
    });
  });

  describe('Step 2 - Dynamic Conditional Rendering', () => {
    it('shows Laptop-specific options: RAM, Storage, Graphics Card', () => {
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=ram-input]').should('be.visible');
      cy.get('[data-cy=storage-input]').should('be.visible');
      cy.get('[data-cy=graphics-group]').should('be.visible');
      cy.get('[data-cy=battery-group]').should('not.exist');
    });

    it('shows Mobile-specific options: RAM, Storage, Battery', () => {
      cy.get('[data-cy=product-type-select]').select('Mobile');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=ram-input]').should('be.visible');
      cy.get('[data-cy=storage-input]').should('be.visible');
      cy.get('[data-cy=battery-group]').should('be.visible');
      cy.get('[data-cy=graphics-group]').should('not.exist');
    });

    it('disables next button when all fields are empty on step 2', () => {
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=next-button]').should('be.disabled');
      cy.get('[data-cy=step2-title]').should('be.visible');
    });

    it('disables next button when Graphics Card is missing for Laptop', () => {
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=ram-input]').select('16GB');
      cy.get('[data-cy=storage-input]').select('512GB SSD');
      // Graphics not selected
      cy.get('[data-cy=next-button]').should('be.disabled');
    });

    it('disables next button when Battery is missing for Mobile', () => {
      cy.get('[data-cy=product-type-select]').select('Mobile');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=ram-input]').select('8GB');
      cy.get('[data-cy=storage-input]').select('128GB');
      // Battery not selected
      cy.get('[data-cy=next-button]').should('be.disabled');
    });

    it('updates progress bar on step 2', () => {
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();
      cy.get('.progress-step.active').should('contain', 'Options');
      cy.get('.progress-step.completed').should('contain', 'Product');
    });
  });

  describe('Backward Navigation', () => {
    it('navigates back from step 2 to step 1', () => {
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=step2-title]').should('be.visible');
      cy.get('[data-cy=back-button]').click();
      cy.get('[data-cy=step1-title]').should('be.visible');
    });

    it('navigates back from summary to step 2', () => {
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=ram-input]').select('16GB');
      cy.get('[data-cy=storage-input]').select('512GB SSD');
      cy.get('[data-cy=graphics-input]').select('NVIDIA RTX 3060');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=summary-title]').should('be.visible');
      cy.get('[data-cy=back-button]').click();
      cy.get('[data-cy=step2-title]').should('be.visible');
    });
  });

  describe('Complete Wizard Flow - Laptop', () => {
    it('completes the wizard successfully with Laptop', () => {
      // Step 1
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();

      // Step 2 - Laptop options
      cy.get('[data-cy=ram-input]').select('16GB');
      cy.get('[data-cy=storage-input]').select('512GB SSD');
      cy.get('[data-cy=graphics-input]').select('NVIDIA RTX 3060');
      cy.get('[data-cy=next-button]').click();

      // Summary
      cy.get('[data-cy=summary-title]').should('be.visible');
      cy.get('[data-cy=summary-productType]').should('contain', 'Laptop');
      cy.get('[data-cy=summary-ram]').should('contain', '16GB');
      cy.get('[data-cy=summary-storage]').should('contain', '512GB SSD');
      cy.get('[data-cy=summary-graphics]').should('contain', 'NVIDIA RTX 3060');
    });
  });

  describe('Complete Wizard Flow - Mobile', () => {
    it('completes the wizard with Mobile showing different options', () => {
      cy.get('[data-cy=product-type-select]').select('Mobile');
      cy.get('[data-cy=next-button]').click();

      // Step 2 - Mobile options
      cy.get('[data-cy=ram-input]').select('8GB');
      cy.get('[data-cy=storage-input]').select('128GB');
      cy.get('[data-cy=battery-input]').select('5000mAh');
      cy.get('[data-cy=next-button]').click();

      // Summary
      cy.get('[data-cy=summary-title]').should('be.visible');
      cy.get('[data-cy=summary-productType]').should('contain', 'Mobile');
      cy.get('[data-cy=summary-ram]').should('contain', '8GB');
      cy.get('[data-cy=summary-storage]').should('contain', '128GB');
      cy.get('[data-cy=summary-battery]').should('contain', '5000mAh');
    });
  });

  describe('Submission - Loading and Error States', () => {
    function navigateToSummary() {
      cy.get('[data-cy=product-type-select]').select('Laptop');
      cy.get('[data-cy=next-button]').click();
      cy.get('[data-cy=ram-input]').select('16GB');
      cy.get('[data-cy=storage-input]').select('512GB SSD');
      cy.get('[data-cy=graphics-input]').select('NVIDIA RTX 3060');
      cy.get('[data-cy=next-button]').click();
    }

    it('shows loading indicator during submission', () => {
      navigateToSummary();

      cy.intercept('POST', '/api/configurations', {
        statusCode: 200,
        body: { id: 1 },
        delay: 500,
      }).as('submitConfig');

      cy.get('[data-cy=submit-button]').click();
      cy.get('[data-cy=loading-indicator]').should('be.visible');
      cy.get('[data-cy=back-button]').should('be.disabled');

      cy.wait('@submitConfig');
      cy.get('[data-cy=success-message]').should('be.visible');
    });

    it('shows success message after successful submission', () => {
      navigateToSummary();

      cy.intercept('POST', '/api/configurations', {
        statusCode: 200,
        body: { id: 1 },
      }).as('submitConfig');

      cy.get('[data-cy=submit-button]').click();
      cy.wait('@submitConfig');
      cy.get('[data-cy=success-message]').should('be.visible');
      cy.contains('Configuration Submitted').should('be.visible');
    });

    it('shows error message on submission failure', () => {
      navigateToSummary();

      cy.intercept('POST', '/api/configurations', {
        statusCode: 500,
        body: { error: 'Server error' },
      }).as('submitConfig');

      cy.get('[data-cy=submit-button]').click();
      cy.wait('@submitConfig');
      cy.get('[data-cy=submit-error]').should('be.visible');
      cy.get('[data-cy=submit-error]').should('contain', 'Submission failed');
    });

    it('allows restart after successful submission', () => {
      navigateToSummary();

      cy.intercept('POST', '/api/configurations', {
        statusCode: 200,
        body: { id: 1 },
      }).as('submitConfig');

      cy.get('[data-cy=submit-button]').click();
      cy.wait('@submitConfig');
      cy.get('[data-cy=success-message]').should('be.visible');
      cy.get('[data-cy=restart-button]').click();
      cy.get('[data-cy=step1-title]').should('be.visible');
    });
  });
});
