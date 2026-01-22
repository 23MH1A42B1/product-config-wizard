import { WizardProvider } from './features/Wizard/WizardContext';
import Wizard from './features/Wizard';

export default function App() {
  return (
    <WizardProvider>
      <Wizard />
    </WizardProvider>
  );
}
