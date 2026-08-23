export type ServiceFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type PricingTier = {
  range: string;
  /** Primary price column. When `priceColumns` is set on the menu item, this is the first column. */
  price: string;
  /** Second price column. Only used when the menu item defines `priceColumns`. */
  priceAlt?: string;
  contents?: string;
};

export type MenuItem = {
  id: string;
  categoryId: 'signature';
  name: string;
  priceText: string;
  description: string;
  imageSrc: string;
  /** Headers for a two-column price table, e.g. ['수입산', '국내산']. Omit for a single price column. */
  priceColumns?: readonly [string, string];
  pricingTiers?: PricingTier[];
  consultationOnly?: boolean;
};

export type GalleryPost = {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  originalUrl: string;
  publishedAt: string; // ISO date string
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type Differentiator = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type BanquetMenuItem = {
  id: string;
  name: string;
  portion: string;
  price: string;
  imageSrc?: string;
};
