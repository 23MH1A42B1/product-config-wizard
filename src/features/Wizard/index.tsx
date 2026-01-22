import { useWizard } from './WizardContext';
import Step1Product from './steps/Step1Product';
import Step2Options from './steps/Step2Options';
import SummaryStep from './steps/SummaryStep';

export default function Wizard() {
  const { state } = useWizard();

  switch (state.value) {
    case 'step1':
      return <Step1Product />;
    case 'step2':
      return <Step2Options />;
    case 'summary':
      return <SummaryStep />;
    default:
      return null;
  }
}
