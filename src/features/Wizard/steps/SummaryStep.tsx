import { useWizard } from '../WizardContext';

export default function SummaryStep() {
  const { state, send } = useWizard() as any;

  return (
    <section aria-labelledby="summary-title">
      <h2 id="summary-title" data-cy="summary-title">
        Summary
      </h2>

      <pre aria-live="polite">
        {JSON.stringify(state.context.globalConfig, null, 2)}
      </pre>

      <button onClick={() => send({ type: 'PREV' })}>
        Back
      </button>
    </section>
  );
}
