import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.canonicalOrigin;
  const now = new Date();
  return [
    { url: `${base}/`,        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/company`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/menu`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ];
}
