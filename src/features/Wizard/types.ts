export interface WizardGlobalConfig {
  productType?: string;
  ram?: string;
  storage?: string;
  graphics?: string;
  battery?: string;
  [key: string]: string | undefined;
}

export interface WizardContext {
  globalConfig: WizardGlobalConfig;
  errorMessage: string;
}
