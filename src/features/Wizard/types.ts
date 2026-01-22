export interface WizardContext {
  globalConfig: {
    productType?: string;
    ram?: string;
    storage?: string;
  };
  errorMessage?: string;
}
