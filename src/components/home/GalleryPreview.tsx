import Link from 'next/link';
import { NAVER } from '@/lib/constants';

const DEMO_PREVIEWS = [
  { id: 'g1', label: '기업 워크샵', emoji: '🏕️' },
  { id: 'g2', label: '가족 모임', emoji: '👨‍👩‍👧‍👦' },
  { id: 'g3', label: '야외 행사', emoji: '🌿' },
];

export default function GalleryPreview() {
  return (
    <section className="py-20 md:py-24 bg-warm-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
              현장 갤러리
            </h2>
            <p className="text-muted text-lg">
              실제 출장 행사 현장 · 생생한 직화구이 모습
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-brand font-semibold hover:underline shrink-0"
          >
            갤러리 더 보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {DEMO_PREVIEWS.map((item) => (
            <div
              key={item.id}
              className="aspect-[4/3] rounded-xl bg-warm-100 border border-cream flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow"
            >
              <span className="text-6xl" aria-hidden="true">{item.emoji}</span>
              <p className="text-muted font-medium text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted">
          더 많은 사진은{' '}
          <a
            href={NAVER.blogHomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand font-semibold hover:underline"
          >
            네이버 블로그
          </a>
          에서 확인하세요
        </p>
      </div>
    </section>
  );
}
