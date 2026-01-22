import { useState } from 'react';
import { useWizard } from '../WizardContext';

export default function Step1Product() {
  const { send } = useWizard();
  const [productType, setProductType] = useState('');

  return (
    <div>
      <h2 id="step1-title" data-cy="step1-title">
        Select Product
      </h2>

      <label htmlFor="productType">Product Type</label>
      <select
        id="productType"
        data-cy="product-type-select"
        value={productType}
        onChange={(e) => setProductType(e.target.value)}
        aria-describedby="productTypeHelp"
      >
        <option value="">Select</option>
        <option value="Laptop">Laptop</option>
        <option value="Mobile">Mobile</option>
      </select>

      <p id="productTypeHelp">
        Please choose a product type to continue.
      </p>

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
