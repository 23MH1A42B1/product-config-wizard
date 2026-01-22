import { useState } from 'react';
import { useWizard } from '../WizardContext';

export default function Step2Options() {
  const { send } = useWizard();
  const [ram, setRam] = useState('');

  return (
    <div>
      <h2 id="step2-title" data-cy="step2-title">
        Configure Options
      </h2>

      <label htmlFor="ramInput">RAM</label>
      <input
        id="ramInput"
        data-cy="ram-input"
        placeholder="e.g. 16GB"
        value={ram}
        onChange={(e) => setRam(e.target.value)}
        aria-describedby="ramHelp"
      />

      <p id="ramHelp">Enter the RAM size.</p>

      <button
        data-cy="next-button"
        onClick={() => send({ type: 'NEXT', data: { ram } })}
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
