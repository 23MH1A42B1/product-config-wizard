import { useState } from 'react';
import { useWizard } from '../WizardContext';
import { PRODUCT_OPTIONS, PRODUCT_REQUIRED_FIELDS } from '../productConfig';

export default function Step2Options() {
  const { send, state } = useWizard();
  const productType = state.context.globalConfig.productType as string;
  const config = PRODUCT_OPTIONS[productType] || {};
  const requiredFields = PRODUCT_REQUIRED_FIELDS[productType] || [];
  const errorMessage = state.context.errorMessage;

  const savedConfig = state.context.globalConfig;
  const [formData, setFormData] = useState<Record<string, string>>({
    ram: savedConfig.ram || '',
    storage: savedConfig.storage || '',
    graphics: savedConfig.graphics || '',
    battery: savedConfig.battery || '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const data: Record<string, string> = {};
    requiredFields.forEach((field) => {
      data[field] = formData[field];
    });
    send({ type: 'NEXT', data });
  };

  const handleBack = () => {
    const data: Record<string, string> = {};
    requiredFields.forEach((field) => {
      data[field] = formData[field];
    });
    send({ type: 'PREV', data });
  };

  const isNextDisabled = requiredFields.some((field) => !formData[field]);
  const isFieldInvalid = (field: string) => !!errorMessage && !formData[field];

  return (
    <section aria-labelledby="step2-title">
      <h2 id="step2-title" data-cy="step2-title">
        Configure {productType} Options
      </h2>

      <div className="form-group">
        <label htmlFor="ramSelect">
          RAM <span aria-hidden="true">*</span>
        </label>
        <select
          id="ramSelect"
          data-cy="ram-input"
          value={formData.ram}
          onChange={(e) => updateField('ram', e.target.value)}
          aria-required="true"
          aria-invalid={isFieldInvalid('ram')}
          aria-describedby={isFieldInvalid('ram') ? 'step2-error' : undefined}
        >
          <option value="">-- Select RAM --</option>
          {config.ram?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="storageSelect">
          Storage <span aria-hidden="true">*</span>
        </label>
        <select
          id="storageSelect"
          data-cy="storage-input"
          value={formData.storage}
          onChange={(e) => updateField('storage', e.target.value)}
          aria-required="true"
          aria-invalid={isFieldInvalid('storage')}
          aria-describedby={isFieldInvalid('storage') ? 'step2-error' : undefined}
        >
          <option value="">-- Select Storage --</option>
          {config.storage?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {productType === 'Laptop' && config.graphics && (
        <div className="form-group" data-cy="graphics-group">
          <label htmlFor="graphicsSelect">
            Graphics Card <span aria-hidden="true">*</span>
          </label>
          <select
            id="graphicsSelect"
            data-cy="graphics-input"
            value={formData.graphics}
            onChange={(e) => updateField('graphics', e.target.value)}
            aria-required="true"
            aria-invalid={isFieldInvalid('graphics')}
            aria-describedby={isFieldInvalid('graphics') ? 'step2-error' : undefined}
          >
            <option value="">-- Select Graphics Card --</option>
            {config.graphics.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {productType === 'Mobile' && config.battery && (
        <div className="form-group" data-cy="battery-group">
          <label htmlFor="batterySelect">
            Battery Capacity <span aria-hidden="true">*</span>
          </label>
          <select
            id="batterySelect"
            data-cy="battery-input"
            value={formData.battery}
            onChange={(e) => updateField('battery', e.target.value)}
            aria-required="true"
            aria-invalid={isFieldInvalid('battery')}
            aria-describedby={isFieldInvalid('battery') ? 'step2-error' : undefined}
          >
            <option value="">-- Select Battery --</option>
            {config.battery.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {errorMessage && (
        <p id="step2-error" role="alert" className="error-message" data-cy="validation-error">
          {errorMessage}
        </p>
      )}

      <div className="button-group">
        <button data-cy="back-button" onClick={handleBack}>
          Back
        </button>
        <button data-cy="next-button" onClick={handleNext} disabled={isNextDisabled}>
          Next
        </button>
      </div>
    </section>
  );
}
