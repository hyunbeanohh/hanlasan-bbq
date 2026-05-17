import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '한라산출장바베큐 — 전국 출장 바베큐 케이터링';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#1a1a1a',
          color: '#fafaf7',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#ea580c', fontWeight: 600, letterSpacing: 4 }}>
          HALLASAN BBQ CATERING
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>
            한라산출장바베큐
          </div>
          <div style={{ fontSize: 36, color: '#e8e3d8' }}>
            전국 출장 바베큐 케이터링 · 정직한 직화구이
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 28, color: '#bdb6a6' }}>
          <span>한라산출장바베큐.kr</span>
          <span style={{ color: '#ea580c', fontSize: 64 }}>🔥</span>
        </div>
      </div>
    ),
    size,
  );
}
