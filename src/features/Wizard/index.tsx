import { useWizard } from './WizardContext';
import Step1Product from './steps/Step1Product';
import Step2Options from './steps/Step2Options';
import SummaryStep from './steps/SummaryStep';
import ProgressBar from '../../components/ProgressBar';

export default function Wizard() {
  const { state } = useWizard();
  const stateValue = state.value as string;

  return (
    <div className="wizard-container" data-cy="wizard-container">
      <ProgressBar currentStep={stateValue} />

      {stateValue === 'step1' && <Step1Product />}
      {stateValue === 'step2' && <Step2Options />}
      {(stateValue === 'summary' || stateValue === 'submitting' || stateValue === 'success' || stateValue === 'failure') && <SummaryStep />}
    </div>
  );
}