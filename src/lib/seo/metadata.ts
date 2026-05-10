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
    title: `${opts.title} | ${SITE.name}`,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: displayUrl,
      siteName: SITE.name,
      locale: 'ko_KR',
      type: 'website',
      images: opts.ogImage
        ? [{ url: opts.ogImage }]
        : [{ url: `${SITE.canonicalOriginDisplay}/images/og/default.svg`, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
  };
}
