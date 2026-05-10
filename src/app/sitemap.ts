import type { MetadataRoute } from 'next';
import { SITE, NAVER } from '@/lib/constants';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.canonicalOrigin; // ASCII (xn--…)
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/company`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/menu`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ];

  const posts = await fetchNaverBlogRss(NAVER.blogId).catch(() => []);
  // Blog posts are external (blog.naver.com); listing them in our sitemap is uncommon.
  // We intentionally include them so Naver/Google see the content connection.
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: p.originalUrl,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...blogEntries];
}
