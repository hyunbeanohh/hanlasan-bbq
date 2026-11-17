import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const config: NextConfig = {
  trailingSlash: false,
  experimental: {
    // CSS를 HTML 안에 넣어 별도 CSS 파일을 기다리지 않고 첫 화면을 그린다(모바일 초기 표시 속도).
    inlineCss: true,
  },
  images: {
    // Cloudflare(OpenNext)에서는 /_next/image가 원본을 그대로 보내고 캐시도 없어서 끈다.
    // 사진은 public/images에 WebP로 미리 줄여 둔 파일을 직접 쓴다.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'postfiles.pstatic.net' },
      { protocol: 'https', hostname: 'blogfiles.naver.net' },
      { protocol: 'https', hostname: 'mblogthumb-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'blogpfthumb-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'blogthumb.pstatic.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // 예전 SNS 공유 이미지 주소(Search Console 404) -> 현재 정적 이미지
      { source: '/opengraph-image', destination: '/opengraph-image.jpg', permanent: true },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wcs.naver.net https://challenges.cloudflare.com https://www.googletagmanager.com"
      : "script-src 'self' 'unsafe-inline' https://wcs.naver.net https://challenges.cloudflare.com https://www.googletagmanager.com";
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: https://*.pstatic.net https://*.naver.net https://wcs.naver.net https://wcs.naver.com https://images.unsplash.com https://*.google-analytics.com https://www.googletagmanager.com",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "font-src 'self' https://cdn.jsdelivr.net data:",
              "connect-src 'self' https://rss.blog.naver.com https://vitals.vercel-insights.com https://wcs.naver.net https://wcs.naver.com https://challenges.cloudflare.com https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com",
              "frame-src https://map.naver.com https://m.map.naver.com https://challenges.cloudflare.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default config;
