export interface ProductOptionConfig {
  ram: string[];
  storage: string[];
  graphics?: string[];
  battery?: string[];
}

export const PRODUCT_OPTIONS: Record<string, ProductOptionConfig> = {
  Laptop: {
    ram: ['8GB', '16GB', '32GB', '64GB'],
    storage: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'],
    graphics: ['Integrated', 'NVIDIA RTX 3060', 'NVIDIA RTX 4090'],
  },
  Mobile: {
    ram: ['4GB', '6GB', '8GB', '12GB'],
    storage: ['64GB', '128GB', '256GB', '512GB'],
    battery: ['3000mAh', '4000mAh', '5000mAh', '6000mAh'],
  },
};

export const PRODUCT_REQUIRED_FIELDS: Record<string, string[]> = {
  Laptop: ['ram', 'storage', 'graphics'],
  Mobile: ['ram', 'storage', 'battery'],
};

export const FIELD_LABELS: Record<string, string> = {
  productType: 'Product Type',
  ram: 'RAM',
  storage: 'Storage',
  graphics: 'Graphics Card',
  battery: 'Battery Capacity',
};
