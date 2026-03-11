import { useState } from 'react';
import { useWizard } from '../WizardContext';
import { PRODUCT_TYPES } from '../types';

const Step1Product = () => {
  const { send, context } = useWizard();
  const [productType, setProductType] = useState('');
  const errorMessage = context.errorMessage;
  const isNextDisabled = !productType;

  const handleNext = () => {
    send({ type: 'NEXT', data: { productType } } as any);
  };

  return (
    <div className="wizard-step" data-cy="step1-container">
      <h2 data-cy="step1-title">Select Product</h2>

      {errorMessage && (
        <p role="alert" className="error-message" data-cy="product-type-error" id="product-type-error">
          {errorMessage}
        </p>
      )}

      <div className="form-group">
        <label htmlFor="productType">
          Product Type
          <span aria-hidden="true" className="required-mark"> *</span>
        </label>
        <select
          id="productType"
          data-cy="product-type-select"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          aria-required="true"
          aria-describedby={errorMessage ? 'product-type-error' : 'product-type-help'}
          aria-invalid={errorMessage ? 'true' : 'false'}
        >
          <option value="">-- Select a product --</option>
          {PRODUCT_TYPES.map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>
        {!errorMessage && (
          <p id="product-type-help" className="field-help">
            Choose the type of product you want to configure.
          </p>
        )}
      </div>

      <div className="wizard-nav" role="group" aria-label="Wizard navigation">
        <button
          data-cy="next-button"
          onClick={handleNext}
          className="btn btn-primary"
          disabled={isNextDisabled}
          aria-disabled={isNextDisabled}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1Product;