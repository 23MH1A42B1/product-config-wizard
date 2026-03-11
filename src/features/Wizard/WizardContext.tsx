import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { wizardMachine } from './WizardMachine';

type WizardContextType = {
  state: ReturnType<typeof useMachine<typeof wizardMachine>>[0];
  send: ReturnType<typeof useMachine<typeof wizardMachine>>[1];
  context: ReturnType<typeof useMachine<typeof wizardMachine>>[0]['context'];
};

const WizardContext = createContext<WizardContextType | null>(null);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, send] = useMachine(wizardMachine);
  return (
    <WizardContext.Provider value={{ state, send, context: state.context }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
};
