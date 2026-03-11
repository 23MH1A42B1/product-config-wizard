import { useWizard } from '../WizardContext';
import { FIELD_LABELS } from '../productConfig';

export default function SummaryStep() {
  const { state, send } = useWizard() as any;
  const config = state.context.globalConfig;
  const errorMessage = state.context.errorMessage;
  const isSubmitting = state.value === 'submitting';

  return (
    <section aria-labelledby="summary-title">
      <h2 id="summary-title" data-cy="summary-title">
        Configuration Summary
      </h2>

      <div className="summary-card">
        <dl className="summary-list" aria-live="polite">
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="summary-item">
              <dt>{FIELD_LABELS[key] || key}</dt>
              <dd data-cy={`summary-${key}`}>{value as string}</dd>
            </div>
          ))}
        </dl>
      </div>

      {errorMessage && (
        <p role="alert" className="error-message" data-cy="submit-error">
          {errorMessage}
        </p>
      )}

      {isSubmitting && (
        <div className="loading-indicator" data-cy="loading-indicator" role="status" aria-live="assertive">
          <span className="spinner" aria-hidden="true"></span>
          <p>Submitting your configuration...</p>
        </div>
      )}

      <div className="button-group">
        <button
          data-cy="back-button"
          onClick={() => send({ type: 'PREV' })}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          data-cy="submit-button"
          className="primary-button"
          onClick={() => send({ type: 'SUBMIT' })}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Configuration'}
        </button>
      </div>
    </section>
  );
}
