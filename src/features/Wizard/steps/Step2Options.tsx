import { useWizard } from '../WizardContext';

export default function Step2Options() {
  const { send } = useWizard();

  return (
    <div>
      <h2 data-cy="step2-title">Options</h2>

      <input
        placeholder="RAM (e.g. 16GB)"
        data-cy="ram-input"
        onChange={(e) =>
          send({ type: 'NEXT', data: { ram: e.target.value } })
        }
      />
    </div>
  );
}
