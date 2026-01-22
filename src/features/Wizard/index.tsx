import { useWizard } from './WizardContext';
import Step1Product from './steps/Step1Product';
import Step2Options from './steps/Step2Options';
import SummaryStep from './steps/SummaryStep';
import ProgressBar from '../../components/ProgressBar';

export default function Wizard() {
  const { state } = useWizard() as any;

  return (
    <div>
      <ProgressBar currentStep={state.value} />

      {state.value === 'step1' && <Step1Product />}
      {state.value === 'step2' && <Step2Options />}
      {state.value === 'summary' && <SummaryStep />}
    </div>
  );
}
