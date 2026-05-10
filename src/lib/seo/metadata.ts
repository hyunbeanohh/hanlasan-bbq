import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';
import { buildCanonical, buildCanonicalDisplay } from './canonical';

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const url = buildCanonical(opts.path);
  const displayUrl = buildCanonicalDisplay(opts.path);

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: displayUrl,
      siteName: SITE.name,
      locale: 'ko_KR',
      type: 'website',
      images: opts.ogImage ? [{ url: opts.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
  };
}
