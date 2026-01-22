import { useState } from 'react';
import { useWizard } from '../WizardContext';

export default function Step2Options() {
  const { send } = useWizard();
  const [ram, setRam] = useState('');

  return (
    <div>
      <h2 data-cy="step2-title">Configure Options</h2>

      <input
        data-cy="ram-input"
        placeholder="RAM (e.g. 16GB)"
        value={ram}
        onChange={(e) => setRam(e.target.value)}
      />

      <br /><br />

      <button
        data-cy="next-button"
        onClick={() =>
          send({ type: 'NEXT', data: { ram } })
        }
      >
        Next
      </button>

      <button
        data-cy="back-button"
        onClick={() => send({ type: 'PREV' })}
      >
        Back
      </button>
    </div>
  );
}
