import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../WizardContext', () => ({
  useWizard: jest.fn(),
}));

import { useWizard } from '../WizardContext';
import SummaryStep from './SummaryStep';

const mockUseWizard = useWizard as jest.MockedFunction<typeof useWizard>;
const mockSend = jest.fn();

function setupMock(overrides: {
  config?: Record<string, string>;
  errorMessage?: string;
  stateValue?: string;
} = {}) {
  const {
    config = {
      productType: 'Laptop',
      ram: '16GB',
      storage: '512GB SSD',
      graphics: 'NVIDIA RTX 3060',
    },
    errorMessage = '',
    stateValue = 'summary',
  } = overrides;
  mockUseWizard.mockReturnValue({
    state: {
      context: {
        globalConfig: config,
        errorMessage,
      },
      value: stateValue,
    },
    send: mockSend,
  } as any);
}

describe('SummaryStep', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  describe('configuration display', () => {
    it('displays configuration summary title', () => {
      setupMock();
      render(<SummaryStep />);
      expect(screen.getByText('Configuration Summary')).toBeInTheDocument();
    });

    it('displays all configuration values', () => {
      setupMock();
      render(<SummaryStep />);
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('16GB')).toBeInTheDocument();
      expect(screen.getByText('512GB SSD')).toBeInTheDocument();
      expect(screen.getByText('NVIDIA RTX 3060')).toBeInTheDocument();
    });

    it('displays field labels correctly', () => {
      setupMock();
      render(<SummaryStep />);
      expect(screen.getByText('Product Type')).toBeInTheDocument();
      expect(screen.getByText('RAM')).toBeInTheDocument();
      expect(screen.getByText('Storage')).toBeInTheDocument();
      expect(screen.getByText('Graphics Card')).toBeInTheDocument();
    });

    it('displays Mobile config with Battery label', () => {
      setupMock({
        config: {
          productType: 'Mobile',
          ram: '8GB',
          storage: '128GB',
          battery: '5000mAh',
        },
      });
      render(<SummaryStep />);
      expect(screen.getByText('Battery Capacity')).toBeInTheDocument();
      expect(screen.getByText('5000mAh')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('renders submit button', () => {
      setupMock();
      render(<SummaryStep />);
      expect(screen.getByRole('button', { name: /submit configuration/i })).toBeInTheDocument();
    });

    it('renders back button', () => {
      setupMock();
      render(<SummaryStep />);
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('sends SUBMIT event on submit button click', () => {
      setupMock();
      render(<SummaryStep />);
      fireEvent.click(screen.getByRole('button', { name: /submit configuration/i }));
      expect(mockSend).toHaveBeenCalledWith({ type: 'SUBMIT' });
    });

    it('sends PREV event on back button click', () => {
      setupMock();
      render(<SummaryStep />);
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      expect(mockSend).toHaveBeenCalledWith({ type: 'PREV' });
    });
  });

  describe('loading state', () => {
    it('shows loading indicator when submitting', () => {
      setupMock({ stateValue: 'submitting' });
      render(<SummaryStep />);
      expect(screen.getByText(/submitting your configuration/i)).toBeInTheDocument();
    });

    it('shows spinner when submitting', () => {
      setupMock({ stateValue: 'submitting' });
      render(<SummaryStep />);
      expect(document.querySelector('[data-cy="loading-indicator"]')).toBeInTheDocument();
    });

    it('disables back button when submitting', () => {
      setupMock({ stateValue: 'submitting' });
      render(<SummaryStep />);
      expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
    });

    it('disables submit button when submitting', () => {
      setupMock({ stateValue: 'submitting' });
      render(<SummaryStep />);
      expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    });

    it('submit button shows "Submitting..." text when loading', () => {
      setupMock({ stateValue: 'submitting' });
      render(<SummaryStep />);
      expect(screen.getByRole('button', { name: /submitting/i })).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('shows error message on submission failure', () => {
      setupMock({ errorMessage: 'Submission failed. Please try again.' });
      render(<SummaryStep />);
      expect(screen.getByText('Submission failed. Please try again.')).toBeInTheDocument();
    });

    it('error has alert role', () => {
      setupMock({ errorMessage: 'Submission failed. Please try again.' });
      render(<SummaryStep />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not show error when no error', () => {
      setupMock({ errorMessage: '' });
      render(<SummaryStep />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has aria-labelledby on section', () => {
      setupMock();
      render(<SummaryStep />);
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('aria-labelledby', 'summary-title');
    });

    it('has correct data-cy attributes', () => {
      setupMock();
      render(<SummaryStep />);
      expect(document.querySelector('[data-cy="summary-title"]')).toBeInTheDocument();
      expect(document.querySelector('[data-cy="submit-button"]')).toBeInTheDocument();
      expect(document.querySelector('[data-cy="back-button"]')).toBeInTheDocument();
    });

    it('has data-cy attributes on summary values', () => {
      setupMock();
      render(<SummaryStep />);
      expect(document.querySelector('[data-cy="summary-productType"]')).toBeInTheDocument();
      expect(document.querySelector('[data-cy="summary-ram"]')).toBeInTheDocument();
    });
  });
});
