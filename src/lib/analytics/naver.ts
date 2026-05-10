declare global {
  interface Window {
    wcs?: { inflow?: (host?: string, ref?: string) => void };
    wcs_add?: Record<string, string>;
    wcs_do?: (event?: Record<string, unknown>) => void;
  }
}

export function trackNaverPageView(): void {
  if (typeof window === 'undefined') return;
  if (!window.wcs_do) return;
  try {
    window.wcs_do();
  } catch {
    // swallow — analytics failure must never break UX
  }
}

export function trackNaverEvent(event: { event: string; [k: string]: unknown }): void {
  if (typeof window === 'undefined') return;
  if (!window.wcs_do) return;
  try {
    window.wcs_do(event);
  } catch {
    // swallow
  }
}
