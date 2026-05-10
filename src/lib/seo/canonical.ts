import { SITE } from '@/lib/constants';

function normalizePath(pathname: string): string {
  const withSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const stripped = withSlash.replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
}

/** ASCII canonical URL (punycode host). Use for HTTP headers, sitemap, robots, JSON-LD. */
export function buildCanonical(pathname: string): string {
  const path = normalizePath(pathname);
  return `${SITE.canonicalOrigin}${path === '/' ? '' : path}`;
}

/** Display canonical URL (Korean host). Use in HTML <link rel="canonical"> and OG tags. */
export function buildCanonicalDisplay(pathname: string): string {
  const path = normalizePath(pathname);
  return `${SITE.canonicalOriginDisplay}${path === '/' ? '' : path}`;
}
