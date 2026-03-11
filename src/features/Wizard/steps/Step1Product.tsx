import { useState } from 'react';
import { useWizard } from '../WizardContext';
import { PRODUCT_TYPES } from '../types';

const Step1Product = () => {
  const { send, context } = useWizard();
  const [productType, setProductType] = useState(context.globalConfig.productType ?? '');

  const errorMessage = context.errorMessage;

  const handleNext = () => {
    send({ type: 'NEXT', data: { productType } } as any);
  };

  return (
    <div data-cy="step1-container" className="wizard-step">
      <h2 data-cy="step1-title">Select Product</h2>

      {errorMessage && (
        <p role="alert" data-cy="step1-error" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}

      <label htmlFor="productType">Product Type</label>
      <select
        id="productType"
        data-cy="product-type-select"
        value={productType}
        onChange={(e) => setProductType(e.target.value)}
        aria-required="true"
      >
        <option value="">Select</option>
        {PRODUCT_TYPES.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <div className="wizard-nav" role="group" aria-label="Wizard navigation">
        <button
          data-cy="next-button"
          onClick={handleNext}
          disabled={!productType}
          aria-disabled={!productType}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1Product;