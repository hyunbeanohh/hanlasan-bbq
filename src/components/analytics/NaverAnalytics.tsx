'use client';
import Script from 'next/script';
import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackNaverPageView } from '@/lib/analytics/naver';

function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    trackNaverPageView();
  }, [pathname, search]);
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
        src="//wcs.naver.net/wcslog.js"
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
