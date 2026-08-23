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
  /** 아이콘 자리를 대신하는 검증 가능한 수치. 예: '30년', '0명' */
  metric: string;
  /** 수치가 무엇을 세는지 알려주는 짧은 라벨. 예: '한 길', '외주·알바' */
  metricLabel: string;
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
