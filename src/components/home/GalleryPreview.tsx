import Link from 'next/link';
import Image from 'next/image';
import { NAVER } from '@/lib/constants';
import type { GalleryPost } from '@/types';

const PLACEHOLDER_CARDS = [
  { id: 'g1', label: '기업 워크샵', date: '2026-04-29' },
  { id: 'g2', label: '가족 모임', date: '2026-04-15' },
  { id: 'g3', label: '야외 행사', date: '2026-03-28' },
];

interface GalleryPreviewProps {
  posts?: GalleryPost[];
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\. /g, '-').replace('.', '').trim();
}

export default function GalleryPreview({ posts = [] }: GalleryPreviewProps) {
  return (
    <section className="py-20 md:py-24 bg-warm-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header — centered, Variant 2 style */}
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            EVENT GALLERY
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            생생한 현장 갤러리
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto" aria-hidden="true" />
        </div>

        {/* 3-column grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-warm-200 block"
                aria-label={post.title}
              >
                {post.thumbnailUrl ? (
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-warm-200 via-warm-100 to-warm-50 flex items-center justify-center">
                    <span className="text-muted text-xs">사진 준비중</span>
                  </div>
                )}
                {/* Date stamp */}
                <span className="absolute top-3 left-3 bg-ink/70 text-white text-xs font-medium px-2 py-1 rounded">
                  {formatShortDate(post.publishedAt)}
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">{post.title}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {PLACEHOLDER_CARDS.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-warm-200 via-warm-100 to-warm-50 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-muted text-xs">사진 준비중</span>
                <span className="absolute top-3 left-3 bg-ink/50 text-white text-xs font-medium px-2 py-1 rounded">
                  {item.date}
                </span>
                <span className="absolute bottom-3 left-3 text-muted text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA link */}
        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm hover:underline"
          >
            갤러리 더 보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
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
      </div>
    </section>
  );
}
