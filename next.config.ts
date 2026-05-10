import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'postfiles.pstatic.net' },
      { protocol: 'https', hostname: 'blogfiles.naver.net' },
      { protocol: 'https', hostname: 'mblogthumb-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'blogpfthumb-phinf.pstatic.net' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default config;
