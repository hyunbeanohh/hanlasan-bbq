const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
type UtmKey = typeof UTM_KEYS[number];
type UtmRecord = Partial<Record<UtmKey, string>>;
const STORAGE_KEY = 'utm_first_touch';

export function captureUtmFromUrl(): void {
  if (typeof window === 'undefined') return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const captured: UtmRecord = {};
    for (const k of UTM_KEYS) {
      const v = sp.get(k);
      if (v) captured[k] = v;
    }
    if (Object.keys(captured).length === 0) return;
    // First-touch: only set if not already set
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (!existing) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }
  } catch {
    // sessionStorage may be unavailable (private mode, embedded webviews)
  }
}

export function getUtm(): UtmRecord {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmRecord) : {};
  } catch {
    return {};
  }
}
