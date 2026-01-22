type ProgressBarProps = {
  currentStep: string;
};

const steps = ['step1', 'step2', 'summary'];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentIndex = steps.indexOf(currentStep) + 1;

  return (
    <div aria-live="polite">
      <p data-cy="progress-indicator">
        Step {currentIndex} of {steps.length}
      </p>
    </div>
  );
}
