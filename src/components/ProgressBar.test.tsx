import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('renders all three steps', () => {
    render(<ProgressBar currentStep="step1" />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('renders step labels', () => {
    render(<ProgressBar currentStep="step1" />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0].textContent).toContain('Product');
    expect(listItems[1].textContent).toContain('Options');
    expect(listItems[2].textContent).toContain('Summary');
  });

  it('marks step1 as active when on step1', () => {
    render(<ProgressBar currentStep="step1" />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveClass('active');
    expect(listItems[1]).not.toHaveClass('active');
    expect(listItems[2]).not.toHaveClass('active');
  });

  it('marks step2 as active and step1 as completed', () => {
    render(<ProgressBar currentStep="step2" />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveClass('completed');
    expect(listItems[1]).toHaveClass('active');
    expect(listItems[2]).not.toHaveClass('active');
  });

  it('marks summary as active, step1 and step2 as completed', () => {
    render(<ProgressBar currentStep="summary" />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveClass('completed');
    expect(listItems[1]).toHaveClass('completed');
    expect(listItems[2]).toHaveClass('active');
  });

  it('sets aria-current on active step', () => {
    render(<ProgressBar currentStep="step2" />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[1]).toHaveAttribute('aria-current', 'step');
    expect(listItems[0]).not.toHaveAttribute('aria-current');
    expect(listItems[2]).not.toHaveAttribute('aria-current');
  });

  it('has navigation landmark with aria-label', () => {
    render(<ProgressBar currentStep="step1" />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Wizard Progress');
  });

  it('has aria-live polite for screen reader', () => {
    render(<ProgressBar currentStep="step1" />);
    const srText = document.querySelector('.sr-only');
    expect(srText).toHaveAttribute('aria-live', 'polite');
  });

  it('has correct data-cy attribute', () => {
    render(<ProgressBar currentStep="step1" />);
    expect(document.querySelector('[data-cy="progress-indicator"]')).toBeInTheDocument();
  });
});
