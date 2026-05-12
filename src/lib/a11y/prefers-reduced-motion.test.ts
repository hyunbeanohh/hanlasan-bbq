import { describe, it, expect, vi, afterEach } from 'vitest';
import { prefersReducedMotion } from './prefers-reduced-motion';

describe('prefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(prefersReducedMotion()).toBe(false);
  });

  it('returns true when the media query matches', () => {
    vi.stubGlobal('window', {
      matchMedia: (q: string) => ({
        matches: q.includes('reduce'),
        media: q,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when the media query does not match', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({
        matches: false,
        media: '',
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    expect(prefersReducedMotion()).toBe(false);
  });
});
