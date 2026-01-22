import { useState } from 'react';
import { useWizard } from '../WizardContext';

export default function Step1Product() {
  const { send } = useWizard();
  const [productType, setProductType] = useState('');

  return (
    <div>
      <h2 data-cy="step1-title">Select Product</h2>

      <select
        data-cy="product-type-select"
        value={productType}
        onChange={(e) => setProductType(e.target.value)}
      >
        <option value="">Select</option>
        <option value="Laptop">Laptop</option>
        <option value="Mobile">Mobile</option>
      </select>

      <br /><br />

      <button
        data-cy="next-button"
        onClick={() =>
          send({
            type: 'NEXT',
            data: { productType },
          })
        }
      >
        Next
      </button>
    </div>
  );
}
