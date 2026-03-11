import { useWizard } from '../WizardContext';

export default function SummaryStep() {
  const { state, send, context } = useWizard();

  const isSubmitting = state.matches('submitting');
  const isSuccess = state.matches('success');
  const isFailure = state.matches('failure');
  const errorMessage = context.errorMessage;

  if (isSuccess) {
    return (
      <section className="wizard-step success-step" aria-labelledby="success-title" data-cy="success-container">
        <h2 id="success-title" data-cy="success-message">
          🎉 Configuration Submitted Successfully!
        </h2>
        <p>Your product configuration has been saved.</p>
        <pre aria-label="Submitted configuration" data-cy="submitted-config">
          {JSON.stringify(context.globalConfig, null, 2)}
        </pre>
      </section>
    );
  }

  return (
    <section className="wizard-step" aria-labelledby="summary-title">
      <h2 id="summary-title" data-cy="summary-title">
        Review Your Configuration
      </h2>

      {isSubmitting && (
        <div role="status" aria-live="polite" data-cy="loading-indicator" className="loading-indicator">
          <span className="spinner" aria-hidden="true">⏳</span>
          <span>Submitting your configuration…</span>
        </div>
      )}

      {isFailure && errorMessage && (
        <p role="alert" className="error-message" data-cy="submit-error">
          {errorMessage}
        </p>
      )}

      <dl className="summary-list" aria-label="Configuration Summary">
        {Object.entries(context.globalConfig).map(([key, value]) => (
          <div key={key} className="summary-item" data-cy={`summary-${key}`}> 
            <dt className="summary-key">{key}</dt>
            <dd className="summary-value">{String(value)}</dd>
          </div>
        ))}
      </dl>

      <div className="wizard-nav" role="group" aria-label="Wizard navigation">
        <button
          data-cy="back-button"
          onClick={() => send({ type: 'PREV' } as any)}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Back
        </button>

        {isFailure ? (
          <button
            data-cy="retry-button"
            onClick={() => send({ type: 'RETRY' } as any)}
            className="btn btn-warning"
            disabled={isSubmitting}
          >
            Retry Submission
          </button>
        ) : (
          <button
            data-cy="submit-button"
            onClick={() => send({ type: 'SUBMIT' } as any)}
            className="btn btn-success"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Configuration'}
          </button>
        )}
      </div>
    </section>
  );
}