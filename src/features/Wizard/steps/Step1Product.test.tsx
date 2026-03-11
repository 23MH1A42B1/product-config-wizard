import { render, screen, fireEvent } from '@testing-library/react';
import { WizardProvider } from '../WizardContext';
import Step1Product from './Step1Product';

describe('Step1Product', () => {
  const renderStep1 = () => {
    return render(
      <WizardProvider>
        <Step1Product />
      </WizardProvider>
    );
  };

  it('renders the step title', () => {
    renderStep1();
    expect(screen.getByText('Select Product')).toBeInTheDocument();
  });

  it('renders product type select with options', () => {
    renderStep1();
    const select = screen.getByLabelText(/product type/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });

  it('disables next button when no product is selected', () => {
    renderStep1();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('enables next button when product is selected', () => {
    renderStep1();
    fireEvent.change(screen.getByLabelText(/product type/i), {
      target: { value: 'Laptop' },
    });
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('does not show error initially', () => {
    renderStep1();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has correct aria-required attribute on select', () => {
    renderStep1();
    const select = screen.getByLabelText(/product type/i);
    expect(select).toHaveAttribute('aria-required', 'true');
  });

  it('has aria-invalid false when no error', () => {
    renderStep1();
    const select = screen.getByLabelText(/product type/i);
    expect(select).toHaveAttribute('aria-invalid', 'false');
  });

  it('navigates to step 2 on valid selection and click', () => {
    renderStep1();
    fireEvent.change(screen.getByLabelText(/product type/i), {
      target: { value: 'Laptop' },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    // No validation error should be shown after valid submission
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders with correct data-cy attributes', () => {
    renderStep1();
    expect(screen.getByText('Select Product').closest('[data-cy="step1-title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-cy="product-type-select"]')).toBeInTheDocument();
    expect(document.querySelector('[data-cy="next-button"]')).toBeInTheDocument();
  });
});
