import Image from 'next/image';
import type { GalleryPost } from '@/types';

interface GalleryCardProps {
  post: GalleryPost;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function GalleryCard({ post }: GalleryCardProps) {
  return (
    <article className="group rounded-2xl overflow-hidden bg-surface border border-border hover:border-border-strong transition-colors flex flex-col">
      {/* Thumbnail */}
      <a
        href={post.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[4/3] block overflow-hidden shrink-0"
        aria-label={`${post.title} — 네이버 블로그에서 보기`}
        tabIndex={-1}
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
          <div className="absolute inset-0 bg-surface-3 flex items-center justify-center">
            <span className="text-fg-muted text-xs">사진 준비중</span>
          </div>
        )}
        {/* Date stamp */}
        <span className="absolute top-3 left-3 bg-bg/80 text-fg-soft text-xs font-medium px-2 py-1 rounded">
          {formatShortDate(post.publishedAt)}
        </span>
      </a>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <time
          dateTime={post.publishedAt}
          className="text-xs text-fg-muted mb-2 block"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="font-bold text-fg text-base mb-2 line-clamp-2 flex-1">
          {post.title}
        </h3>
        {post.summary && (
          <p className="text-fg-muted text-sm leading-relaxed mb-4 line-clamp-2">
            {post.summary}
          </p>
        )}
        <a
          href={post.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-brand text-sm font-semibold hover:underline"
          aria-label={`${post.title} — 네이버 블로그에서 보기`}
        >
          블로그에서 보기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
      </div>
    </article>
  );
}
