import { render, screen, fireEvent } from '@testing-library/react';
import { WizardProvider } from '../WizardContext';
import Step1Product from './Step1Product';

describe('Step1Product', () => {
  it('shows validation error when clicking next without selection', () => {
    render(
      <WizardProvider>
        <Step1Product />
      </WizardProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(
      screen.getByText(/select a product/i)
    ).toBeInTheDocument();
  });
});
