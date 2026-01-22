import { useWizard } from '../WizardContext';

export default function Step1Product() {
  const { state, send } = useWizard();

  const handleNext = (value: string) => {
    if (!value) {
      send({
        type: 'NEXT',
        data: {},
      });
    } else {
      send({
        type: 'NEXT',
        data: { productType: value },
      });
    }
  };

  return (
    <div>
      <h2 data-cy="step1-title">Select Product</h2>

      <select
        data-cy="product-type-select"
        onChange={(e) => handleNext(e.target.value)}
      >
        <option value="">Select</option>
        <option value="Laptop">Laptop</option>
        <option value="Mobile">Mobile</option>
      </select>

      {state.context?.errorMessage && (
        <p style={{ color: 'red' }} data-cy="product-type-error">
          Product type is required
        </p>
      )}
    </div>
  );
}
