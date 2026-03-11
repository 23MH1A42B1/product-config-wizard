import { useState, useEffect } from 'react';
import { useWizard } from '../WizardContext';
import { PRODUCT_STEP2_FIELDS } from '../types';
import type { ProductType } from '../types';

const FIELD_LABELS: Record<string, string> = {
  ram: 'RAM',
  storage: 'Storage',
  color: 'Color',
  screenSize: 'Screen Size',
};

const FIELD_PLACEHOLDERS: Record<string, string> = {
  ram: 'e.g. 16GB',
  storage: 'e.g. 512GB SSD',
  color: 'e.g. Midnight Black',
  screenSize: 'e.g. 15.6"',
};

export default function Step2Options() {
  const { send, context } = useWizard();
  const productType = context.globalConfig.productType as ProductType | undefined;
  const fields = productType ? (PRODUCT_STEP2_FIELDS[productType] ?? ['ram']) : ['ram'];

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => { init[f] = ''; });
    return init;
  });

  useEffect(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => { init[f] = ''; });
    setFormData(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType]);

  const errorMessage = context.errorMessage;
  const isNextDisabled = !formData['ram'] || formData['ram'].trim() === '';

  const handleNext = () => {
    send({ type: 'NEXT', data: formData } as any);
  };

  return (
    <div className="wizard-step" data-cy="step2-container">
      <h2 id="step2-title" data-cy="step2-title">
        Configure Options
        {productType && (
          <span className="step-subtitle"> — {productType}</span>
        )}
      </h2>

      {errorMessage && (
        <p role="alert" className="error-message" data-cy="step2-error" id="step2-error-msg">
          {errorMessage}
        </p>
      )}

      <fieldset aria-labelledby="step2-title">
        <legend className="sr-only">Configure {productType || 'Product'} Options</legend>

        {fields.map((field) => {
          const inputId = `input-${field}`;
          const errorId = `error-${field}`;
          const hasError = field === 'ram' && !!errorMessage;

          return (
            <div key={field} className="form-group">
              <label htmlFor={inputId}>
                {FIELD_LABELS[field] ?? field}
                <span aria-hidden="true" className="required-mark"> *</span>
              </label>
              <input
                id={inputId}
                data-cy={`${field}-input`}
                placeholder={FIELD_PLACEHOLDERS[field] ?? ''}
                value={formData[field] ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                }
                aria-required={field === 'ram' ? 'true' : 'false'}
                aria-describedby={hasError ? errorId : `help-${field}`}
                aria-invalid={hasError ? 'true' : 'false'}
              />
              {hasError ? (
                <p id={errorId} role="alert" className="field-error" data-cy={`${field}-error`}>
                  {errorMessage}
                </p>
              ) : (
                <p id={`help-${field}`} className="field-help">
                  {FIELD_PLACEHOLDERS[field] ? `Enter ${FIELD_LABELS[field] ?? field}` : ''}
                </p>
              )}
            </div>
          );
        })}
      </fieldset>

      <div className="wizard-nav" role="group" aria-label="Wizard navigation">
        <button
          data-cy="back-button"
          onClick={() => send({ type: 'PREV' } as any)}
          className="btn btn-secondary"
        >
          Back
        </button>
        <button
          data-cy="next-button"
          onClick={handleNext}
          className="btn btn-primary"
          disabled={isNextDisabled}
          aria-disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
}