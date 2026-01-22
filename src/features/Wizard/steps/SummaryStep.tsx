import { useWizard } from '../WizardContext';

export default function SummaryStep() {
  const { state } = useWizard();

  return (
    <div>
      <h2 data-cy="summary-title">Summary</h2>
      <pre>{JSON.stringify(state.context.globalConfig, null, 2)}</pre>
    </div>
  );
}
