import type { NextConfig } from 'next';

const config: NextConfig = {
  trailingSlash: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'postfiles.pstatic.net' },
      { protocol: 'https', hostname: 'blogfiles.naver.net' },
      { protocol: 'https', hostname: 'mblogthumb-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'blogpfthumb-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wcs.naver.net https://challenges.cloudflare.com"
      : "script-src 'self' 'unsafe-inline' https://wcs.naver.net https://challenges.cloudflare.com";
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
              "img-src 'self' data: https://*.pstatic.net https://*.naver.net https://wcs.naver.net https://images.unsplash.com",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "font-src 'self' https://cdn.jsdelivr.net data:",
              "connect-src 'self' https://rss.blog.naver.com https://vitals.vercel-insights.com https://wcs.naver.net https://challenges.cloudflare.com",
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
