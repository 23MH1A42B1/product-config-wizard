import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { wizardMachine } from './WizardMachine';

type WizardContextType = {
  state: any;
  send: (event: { type: string; data?: Record<string, unknown> }) => void;
};

const WizardContext = createContext<WizardContextType | null>(null);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, send] = useMachine(wizardMachine);

  return (
    <WizardContext.Provider value={{ state, send }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
};
