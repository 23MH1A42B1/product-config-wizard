import { useWizard } from '../WizardContext';

export default function Step2Options() {
  const { send } = useWizard();

  return (
    <div>
      <h2 data-cy="step2-title">Configure Options</h2>

      <input
        data-cy="ram-input"
        placeholder="RAM (e.g. 16GB)"
        onChange={(e) =>
          send({ type: 'NEXT', data: { ram: e.target.value } })
        }
      />

      <br /><br />

      <button
        type="button"
        data-cy="back-button"
        onClick={() => send({ type: 'PREV' })}
      >
        Back
      </button>
    </div>
  );
}
