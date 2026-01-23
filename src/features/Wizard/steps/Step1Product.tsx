import { useState } from 'react';
import { useWizard } from '../WizardContext';

const Step1Product = () => {
  const { send } = useWizard();
  const [productType, setProductType] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!productType) {
      setError('Please select a product');
      return;
    }

    setError('');
    send({ type: 'NEXT', data: { productType } });
  };

  return (
    <div>
      <h2 data-cy="step1-title">Select Product</h2>

      <label htmlFor="productType">Product Type</label>
      <select
        id="productType"
        data-cy="product-type-select"
        value={productType}
        onChange={(e) => setProductType(e.target.value)}
      >
        <option value="">Select</option>
        <option value="Laptop">Laptop</option>
        <option value="Mobile">Mobile</option>
      </select>

      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <button data-cy="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default Step1Product;
