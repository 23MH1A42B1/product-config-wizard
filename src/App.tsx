import { WizardProvider } from './features/Wizard/WizardContext';
import Wizard from './features/Wizard';
import './App.css';
import './styles/wizard.css';

export default function App() {
  return (
    <WizardProvider>
      <Wizard />
    </WizardProvider>
  );
}
