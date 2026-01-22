import { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { wizardMachine } from './WizardMachine';

type WizardContextType = {
  state: unknown;
  send: (event: { type: string; data?: Record<string, unknown> }) => void;
};

/**
 * Context is initialized as null
 * (this avoids undefined inference issues)
 */
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

  if (context === null) {
    throw new Error('useWizard must be used within WizardProvider');
  }

  return context;
};
