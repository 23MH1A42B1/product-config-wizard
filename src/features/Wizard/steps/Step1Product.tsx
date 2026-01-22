import { useWizard } from '../WizardContext';

export default function Step1Product() {
  const { send } = useWizard();

  return (
    <div>
      <h2 data-cy="step1-title">Select Product</h2>

      <select
        data-cy="product-type-select"
        onChange={(e) =>
          send({ type: 'NEXT', data: { productType: e.target.value } })
        }
      >
        <option value="">Select</option>
        <option value="Laptop">Laptop</option>
        <option value="Mobile">Mobile</option>
      </select>
    </div>
  );
}
