import { SITE } from '@/lib/constants';

export function buildCanonical(pathname: string): string {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE.canonicalOrigin}${clean === '/' ? '' : clean}`;
}
