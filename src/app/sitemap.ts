import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { MENU_PAGES } from '@/data/menu-pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.canonicalOrigin;
  const now = new Date();
  return [
    { url: `${base}/`,        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/company`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/menu`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/banquet`, lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/catering`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...MENU_PAGES.map((p) => ({
      url: `${base}/menu/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
