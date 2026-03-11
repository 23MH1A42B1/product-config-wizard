import { useWizard } from './WizardContext';
import Step1Product from './steps/Step1Product';
import Step2Options from './steps/Step2Options';
import SummaryStep from './steps/SummaryStep';
import ProgressBar from '../../components/ProgressBar';

export default function Wizard() {
  const { state, send } = useWizard() as any;
  const currentStep = state.value as string;

  if (currentStep === 'success') {
    return (
      <div className="wizard-container">
        <div className="success-container" data-cy="success-message">
          <div className="success-icon" aria-hidden="true">✓</div>
          <h2>Configuration Submitted!</h2>
          <p>Your product configuration has been successfully submitted.</p>
          <div className="button-group" style={{ justifyContent: 'center' }}>
            <button
              data-cy="restart-button"
              className="primary-button"
              onClick={() => send({ type: 'RESTART' })}
            >
              Configure Another Product
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-container">
      <ProgressBar currentStep={currentStep === 'submitting' ? 'summary' : currentStep} />

      {currentStep === 'step1' && <Step1Product />}
      {currentStep === 'step2' && <Step2Options />}
      {(currentStep === 'summary' || currentStep === 'submitting') && <SummaryStep />}
    </div>
  );
}
