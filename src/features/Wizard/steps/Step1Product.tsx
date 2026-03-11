import { useState } from 'react';
import { useWizard } from '../WizardContext';

const Step1Product = () => {
  const { send, state } = useWizard();
  const [productType, setProductType] = useState(
    state.context.globalConfig.productType || ''
  );
  const errorMessage = state.context.errorMessage;

  const handleNext = () => {
    send({ type: 'NEXT', data: { productType } });
  };

  return (
    <section aria-labelledby="step1-title">
      <h2 id="step1-title" data-cy="step1-title">Select Product</h2>

      <div className="form-group">
        <label htmlFor="productType">
          Product Type <span aria-hidden="true">*</span>
        </label>
        <select
          id="productType"
          data-cy="product-type-select"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          aria-required="true"
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? 'product-error' : undefined}
        >
          <option value="">-- Select a product --</option>
          <option value="Laptop">Laptop</option>
          <option value="Mobile">Mobile</option>
        </select>

        {errorMessage && (
          <p id="product-error" role="alert" className="error-message" data-cy="validation-error">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="button-group">
        <button data-cy="next-button" onClick={handleNext} disabled={!productType}>
          Next
        </button>
      </div>
    </section>
  );
};

export default Step1Product;
