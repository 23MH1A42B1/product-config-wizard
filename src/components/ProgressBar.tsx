type ProgressBarProps = {
  currentStep: string;
};

const steps = ['step1', 'step2', 'summary'];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentIndex = steps.indexOf(currentStep) + 1;

  return (
    <nav aria-label="Wizard Progress">
      <p
        data-cy="progress-indicator"
        aria-current="step"
        aria-live="polite"
      >
        Step {currentIndex} of {steps.length}
      </p>
    </nav>
  );
}
