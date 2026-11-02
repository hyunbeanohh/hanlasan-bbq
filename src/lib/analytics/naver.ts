/** 네이버 광고 전환추적 공통키 (한라산출장바베큐.kr) */
export const NAVER_ANALYTICS_ID = 's_3cd13a72248';

/** 네이버 전환 유형: lead = 견적/문의 접수 완료, custom001 = 전화 버튼 클릭 */
export type NaverConversionType = 'lead' | 'custom001';

declare global {
  interface Window {
    wcs?: {
      inflow?: (host?: string, ref?: string) => void;
      trans?: (conv: { type: string }) => void;
    };
    wcs_add?: Record<string, string>;
    wcs_do?: (event?: Record<string, unknown>) => void;
  }
}

// wcslog.js 로드 전에 발생한 전환은 로드 직후 전송한다.
let pendingConversions: NaverConversionType[] = [];
let lastPageViewKey: string | null = null;

function ensureAccount(): void {
  if (!window.wcs_add) window.wcs_add = {};
  if (!window.wcs_add['wa']) window.wcs_add['wa'] = NAVER_ANALYTICS_ID;
}

/** 페이지뷰 전송. 같은 key(경로+쿼리)는 한 번만 보낸다. */
export function trackNaverPageView(key?: string): void {
  if (typeof window === 'undefined') return;
  if (!window.wcs || !window.wcs_do) return;
  if (key !== undefined && key === lastPageViewKey) return;
  try {
    ensureAccount();
    window.wcs.inflow?.();
    window.wcs_do();
    if (key !== undefined) lastPageViewKey = key;
  } catch {
    // swallow — analytics failure must never break UX
  }
}

/** 전환 이벤트 전송. 스크립트가 아직 없으면 대기열에 넣는다. 개인정보는 보내지 않는다. */
export function trackNaverConversion(type: NaverConversionType): void {
  if (typeof window === 'undefined') return;
  if (!window.wcs?.trans) {
    pendingConversions.push(type);
    return;
  }
  try {
    ensureAccount();
    window.wcs.trans({ type });
  } catch {
    // swallow
  }
}

/** wcslog.js 로드 직후 호출: 대기 중인 전환을 전송한다. */
export function flushNaverConversions(): void {
  if (typeof window === 'undefined' || !window.wcs?.trans) return;
  const queued = pendingConversions;
  pendingConversions = [];
  queued.forEach((type) => trackNaverConversion(type));
}

/** 테스트용 상태 초기화 */
export function resetNaverAnalyticsState(): void {
  pendingConversions = [];
  lastPageViewKey = null;
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
