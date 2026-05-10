import type { Metadata } from 'next';
import './globals.css';
import { SITE } from '@/lib/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileCTABar from '@/components/layout/MobileCTABar';
import LocalBusinessJsonLd from '@/components/seo/LocalBusinessJsonLd';
import NaverAnalytics from '@/components/analytics/NaverAnalytics';
import UtmCapture from '@/components/analytics/UtmCapture';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.canonicalOriginDisplay),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ['출장바베큐', '제주출장바베큐', '한라산출장바베큐', '제주 케이터링', '제주 바베큐 출장', '기업 케이터링', '단체 회식 출장'],
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
    other: {
      ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION && {
        'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
      }),
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased pb-[60px] md:pb-0">
        <LocalBusinessJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileCTABar />
        <NaverAnalytics accountId={process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID ?? ''} />
        <UtmCapture />
      </body>
    </html>
  );
}
