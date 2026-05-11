export type ServiceFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type MenuItem = {
  id: string;
  categoryId: 'signature';
  name: string;
  priceText: string;
  description: string;
  imageSrc: string;
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
