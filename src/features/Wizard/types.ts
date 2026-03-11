export interface WizardContext {
  globalConfig: {
    productType?: string;
    ram?: string;
    storage?: string;
    color?: string;
    screenSize?: string;
  };
  errorMessage: string;
  isSubmitting: boolean;
  submitSuccess: boolean;
}

export const PRODUCT_TYPES = ['Laptop', 'Mobile', 'Tablet', 'Desktop'] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const PRODUCT_STEP2_FIELDS: Record<ProductType, string[]> = {
  Laptop: ['ram', 'storage', 'screenSize'],
  Mobile: ['ram', 'color'],
  Tablet: ['ram', 'storage'],
  Desktop: ['ram', 'storage'],
};
