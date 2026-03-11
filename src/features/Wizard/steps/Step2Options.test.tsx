import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../WizardContext', () => ({
  useWizard: jest.fn(),
}));

import { useWizard } from '../WizardContext';
import Step2Options from './Step2Options';

const mockUseWizard = useWizard as jest.MockedFunction<typeof useWizard>;
const mockSend = jest.fn();

function setupMock(overrides: {
  productType?: string;
  errorMessage?: string;
  savedConfig?: Record<string, string>;
} = {}) {
  const { productType = 'Laptop', errorMessage = '', savedConfig = {} } = overrides;
  mockUseWizard.mockReturnValue({
    state: {
      context: {
        globalConfig: { productType, ...savedConfig },
        errorMessage,
      },
      value: 'step2',
    },
    send: mockSend,
  } as any);
}

describe('Step2Options', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  describe('dynamic rendering', () => {
    it('renders Laptop-specific options (RAM, Storage, Graphics)', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      expect(screen.getByLabelText(/ram/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/storage/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/graphics card/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/battery/i)).not.toBeInTheDocument();
    });

    it('renders Mobile-specific options (RAM, Storage, Battery)', () => {
      setupMock({ productType: 'Mobile' });
      render(<Step2Options />);
      expect(screen.getByLabelText(/ram/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/storage/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/battery/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/graphics card/i)).not.toBeInTheDocument();
    });

    it('shows dynamic title based on product type', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      expect(screen.getByText(/configure laptop options/i)).toBeInTheDocument();
    });

    it('shows Mobile in title when Mobile selected', () => {
      setupMock({ productType: 'Mobile' });
      render(<Step2Options />);
      expect(screen.getByText(/configure mobile options/i)).toBeInTheDocument();
    });

    it('renders Laptop RAM options correctly', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      expect(screen.getByText('8GB')).toBeInTheDocument();
      expect(screen.getByText('16GB')).toBeInTheDocument();
      expect(screen.getByText('32GB')).toBeInTheDocument();
      expect(screen.getByText('64GB')).toBeInTheDocument();
    });

    it('renders Mobile RAM options correctly', () => {
      setupMock({ productType: 'Mobile' });
      render(<Step2Options />);
      expect(screen.getByText('4GB')).toBeInTheDocument();
      expect(screen.getByText('6GB')).toBeInTheDocument();
      expect(screen.getByText('8GB')).toBeInTheDocument();
      expect(screen.getByText('12GB')).toBeInTheDocument();
    });
  });

  describe('validation errors', () => {
    it('displays error message from machine context', () => {
      setupMock({ errorMessage: 'Please select RAM' });
      render(<Step2Options />);
      expect(screen.getByText('Please select RAM')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not display error when no error in context', () => {
      setupMock({ errorMessage: '' });
      render(<Step2Options />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('sets aria-invalid on empty fields when error exists', () => {
      setupMock({ errorMessage: 'Please select RAM' });
      render(<Step2Options />);
      const ramSelect = screen.getByLabelText(/ram/i);
      expect(ramSelect).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('form interactions', () => {
    it('sends NEXT event with form data', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '16GB' } });
      fireEvent.change(screen.getByLabelText(/storage/i), { target: { value: '512GB SSD' } });
      fireEvent.change(screen.getByLabelText(/graphics card/i), { target: { value: 'NVIDIA RTX 3060' } });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(mockSend).toHaveBeenCalledWith({
        type: 'NEXT',
        data: expect.objectContaining({
          ram: '16GB',
          storage: '512GB SSD',
          graphics: 'NVIDIA RTX 3060',
        }),
      });
    });

    it('sends PREV event with form data when back clicked', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '16GB' } });
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      expect(mockSend).toHaveBeenCalledWith({
        type: 'PREV',
        data: expect.objectContaining({ ram: '16GB' }),
      });
    });

    it('sends Mobile-specific fields for Mobile', () => {
      setupMock({ productType: 'Mobile' });
      render(<Step2Options />);
      fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '8GB' } });
      fireEvent.change(screen.getByLabelText(/storage/i), { target: { value: '128GB' } });
      fireEvent.change(screen.getByLabelText(/battery/i), { target: { value: '5000mAh' } });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(mockSend).toHaveBeenCalledWith({
        type: 'NEXT',
        data: expect.objectContaining({
          ram: '8GB',
          storage: '128GB',
          battery: '5000mAh',
        }),
      });
    });
  });

  describe('pre-filled values', () => {
    it('initializes from saved context', () => {
      setupMock({
        productType: 'Laptop',
        savedConfig: { ram: '32GB', storage: '1TB SSD', graphics: 'NVIDIA RTX 4090' },
      });
      render(<Step2Options />);
      expect((screen.getByLabelText(/ram/i) as HTMLSelectElement).value).toBe('32GB');
      expect((screen.getByLabelText(/storage/i) as HTMLSelectElement).value).toBe('1TB SSD');
      expect((screen.getByLabelText(/graphics card/i) as HTMLSelectElement).value).toBe('NVIDIA RTX 4090');
    });
  });

  describe('disabled next button', () => {
    it('disables next button when all required fields are empty', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('disables next button when some required fields are empty for Laptop', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '16GB' } });
      fireEvent.change(screen.getByLabelText(/storage/i), { target: { value: '512GB SSD' } });
      // graphics not selected
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('enables next button when all Laptop fields are filled', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '16GB' } });
      fireEvent.change(screen.getByLabelText(/storage/i), { target: { value: '512GB SSD' } });
      fireEvent.change(screen.getByLabelText(/graphics card/i), { target: { value: 'NVIDIA RTX 3060' } });
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    });

    it('enables next button when all Mobile fields are filled', () => {
      setupMock({ productType: 'Mobile' });
      render(<Step2Options />);
      fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '8GB' } });
      fireEvent.change(screen.getByLabelText(/storage/i), { target: { value: '128GB' } });
      fireEvent.change(screen.getByLabelText(/battery/i), { target: { value: '5000mAh' } });
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    });

    it('disables next button when some Mobile fields are empty', () => {
      setupMock({ productType: 'Mobile' });
      render(<Step2Options />);
      fireEvent.change(screen.getByLabelText(/ram/i), { target: { value: '8GB' } });
      // storage and battery not selected
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('all selects have aria-required', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      expect(screen.getByLabelText(/ram/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/storage/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/graphics card/i)).toHaveAttribute('aria-required', 'true');
    });

    it('has correct data-cy attributes', () => {
      setupMock({ productType: 'Laptop' });
      render(<Step2Options />);
      expect(document.querySelector('[data-cy="ram-input"]')).toBeInTheDocument();
      expect(document.querySelector('[data-cy="storage-input"]')).toBeInTheDocument();
      expect(document.querySelector('[data-cy="graphics-input"]')).toBeInTheDocument();
      expect(document.querySelector('[data-cy="next-button"]')).toBeInTheDocument();
      expect(document.querySelector('[data-cy="back-button"]')).toBeInTheDocument();
    });
  });
});
