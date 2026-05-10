import Link from 'next/link';
import { NAVER } from '@/lib/constants';
import type { GalleryPost } from '@/types';

interface GalleryPreviewProps {
  posts?: GalleryPost[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

const PLACEHOLDER_ITEMS = [
  { id: 'g1', label: '기업 워크샵 케이터링', tag: '기업 행사' },
  { id: 'g2', label: '가족 모임 직화구이', tag: '가족 모임' },
  { id: 'g3', label: '야외 바베큐 파티', tag: '야외 행사' },
];

export default function GalleryPreview({ posts = [] }: GalleryPreviewProps) {
  return (
    <section className="py-[120px] bg-[#1a1c1c]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-3 block">
              GALLERY
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-white uppercase leading-tight border-l-4 border-[#f95e14] pl-6"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              현장 갤러리
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-[#ffb59a] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors shrink-0"
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

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-[#1e2020] border border-white/5 hover:border-[#f95e14] transition-colors duration-500 overflow-hidden group flex flex-col"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 80%, rgba(249,94,20,0.3) 0%, transparent 70%)',
                    }}
                  />
                  <p className="text-zinc-600 text-xs relative z-10">[사진 준비중]</p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-zinc-500 mb-2 block uppercase tracking-wider"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                  <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-4 line-clamp-2">
                    {post.summary}
                  </p>
                  <a
                    href={post.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#f95e14] text-sm font-bold uppercase tracking-wider hover:text-[#ffb59a] transition-colors"
                    aria-label={`${post.title} — 네이버 블로그에서 보기`}
                  >
                    블로그에서 보기 →
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PLACEHOLDER_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-[#1e2020] border border-white/5 overflow-hidden group"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex flex-col items-center justify-center gap-3 relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 80%, rgba(249,94,20,0.3) 0%, transparent 70%)',
                    }}
                  />
                  <p className="text-zinc-600 text-xs relative z-10">[사진 준비중]</p>
                </div>
                <div className="p-6">
                  <span className="text-[#f95e14] text-xs font-bold uppercase tracking-wider mb-2 block">
                    {item.tag}
                  </span>
                  <h3 className="text-white font-bold text-base">{item.label}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-zinc-500 mt-10">
          더 많은 사진은{' '}
          <a
            href={NAVER.blogHomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffb59a] font-bold hover:text-white transition-colors"
          >
            네이버 블로그
          </a>
          에서 확인하세요
        </p>
      </div>
    </section>
  );
}
