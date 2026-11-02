'use client';
import Script from 'next/script';
import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  flushNaverConversions,
  trackNaverConversion,
  trackNaverPageView,
} from '@/lib/analytics/naver';

function currentPageKey(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  const created = search.get('created');

  // 클라이언트 라우팅마다 페이지뷰 전송 (최초 로드는 스크립트 onLoad에서 처리)
  useEffect(() => {
    trackNaverPageView(currentPageKey());
  }, [pathname, search]);

  // 예약 문의 게시판 글 등록 완료(/inquiry/{id}?created=1) = 신청완료 전환
  useEffect(() => {
    if (created === '1' && /^\/inquiry\/[^/]+$/.test(pathname)) {
      // 새로고침으로 같은 글이 다시 집계되지 않도록 글마다 한 번만 보낸다.
      const storageKey = `naver_lead_sent:${pathname}`;
      try {
        if (window.sessionStorage.getItem(storageKey)) return;
        window.sessionStorage.setItem(storageKey, '1');
      } catch {
        // sessionStorage를 쓸 수 없으면 그대로 전송
      }
      trackNaverConversion('lead');
    }
  }, [pathname, created]);

  return null;
}

function PhoneClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]');
      if (link?.getAttribute('href')?.startsWith('tel:')) {
        trackNaverConversion('custom001');
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}

export default function NaverAnalytics({ accountId }: { accountId: string }) {
  if (!accountId) return null;
  return (
    <>
      <Script
        id="naver-analytics-init"
        strategy="afterInteractive"
        // wcs_add must be set BEFORE wcslog.js runs
        dangerouslySetInnerHTML={{
          __html: `var wcs_add = wcs_add || {}; wcs_add["wa"] = "${accountId}";`,
        }}
      />
      <Script
        id="naver-analytics-loader"
        src="https://wcs.naver.net/wcslog.js"
        strategy="afterInteractive"
        onLoad={() => {
          trackNaverPageView(currentPageKey());
          flushNaverConversions();
        }}
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <PhoneClickTracker />
    </>
  );
}
