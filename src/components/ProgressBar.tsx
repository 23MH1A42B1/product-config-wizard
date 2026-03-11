import { WIZARD_STEPS } from '../features/Wizard/WizardMachine';

const STEP_LABELS: Record<string, string> = {
  step1: 'Product',
  step2: 'Options',
  summary: 'Summary',
};

type ProgressBarProps = {
  currentStep: string;
};

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep as (typeof WIZARD_STEPS)[number]);

  return (
    <nav aria-label="Wizard Progress">
      <ol className="progress-bar" data-cy="progress-indicator">
        {WIZARD_STEPS.map((step, index) => (
          <li
            key={step}
            className={`progress-step${
              index === currentIndex ? ' active' : ''
            }${index < currentIndex ? ' completed' : ''}`}
            aria-current={index === currentIndex ? 'step' : undefined}
          >
            <span aria-hidden="true">{index + 1}. </span>
            {STEP_LABELS[step]}
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        Step {currentIndex + 1} of {WIZARD_STEPS.length}: {STEP_LABELS[currentStep]}
      </p>
    </nav>
  );
}
