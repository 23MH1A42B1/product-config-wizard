import { render, screen, fireEvent, act } from '@testing-library/react';
import { WizardProvider } from './WizardContext';
import Wizard from './index';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

describe('Wizard', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  const renderWizard = () => {
    return render(
      <WizardProvider>
        <Wizard />
      </WizardProvider>
    );
  };

  it('renders step 1 initially', () => {
    renderWizard();
    expect(screen.getByText('Select Product')).toBeInTheDocument();
  });

  it('renders progress bar', () => {
    renderWizard();
    expect(document.querySelector('[data-cy="progress-indicator"]')).toBeInTheDocument();
  });

  it('navigates through the full wizard flow', () => {
    renderWizard();

    // Step 1
    expect(screen.getByText('Select Product')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/product type/i), { target: { value: 'Laptop' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 2
    expect(screen.getByText(/configure laptop options/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '16GB' } });
    fireEvent.change(screen.getByLabelText(/storage/i), { target: { value: '512GB SSD' } });
    fireEvent.change(screen.getByLabelText(/graphics card/i), { target: { value: 'NVIDIA RTX 3060' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Summary
    expect(screen.getByText('Configuration Summary')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('16GB')).toBeInTheDocument();
  });

  it('shows success view and allows restart', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });

    renderWizard();

    // Navigate to summary
    fireEvent.change(screen.getByLabelText(/product type/i), { target: { value: 'Laptop' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '16GB' } });
    fireEvent.change(screen.getByLabelText(/storage/i), { target: { value: '512GB SSD' } });
    fireEvent.change(screen.getByLabelText(/graphics card/i), { target: { value: 'NVIDIA RTX 3060' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Submit
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit configuration/i }));
    });

    // Wait for success
    await screen.findByText(/configuration submitted/i);
    expect(screen.getByText(/configuration submitted/i)).toBeInTheDocument();

    // Restart
    fireEvent.click(screen.getByRole('button', { name: /configure another product/i }));
    expect(screen.getByText('Select Product')).toBeInTheDocument();
  });

  it('shows wizard container class', () => {
    renderWizard();
    expect(document.querySelector('.wizard-container')).toBeInTheDocument();
  });
});
