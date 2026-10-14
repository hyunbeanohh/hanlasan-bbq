import Image from 'next/image';
import type { GalleryPost } from '@/types';

interface GalleryCardProps {
  post: GalleryPost;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function GalleryCard({ post }: GalleryCardProps) {
  return (
    <article className="group flex flex-col">
      {/* Thumbnail */}
      <a
        href={post.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[4/3] shrink-0 overflow-hidden rounded-xl"
        aria-label={`${post.title} — 네이버 블로그에서 보기`}
        tabIndex={-1}
      >
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="bg-surface-3 absolute inset-0 flex items-center justify-center">
            <span className="text-fg-muted text-xs">사진 준비중</span>
          </div>
        )}
      </a>

      {/* Content */}
      <div className="flex flex-1 flex-col py-5">
        <time dateTime={post.publishedAt} className="text-fg-muted mb-2 block text-xs">
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="text-fg mb-2 line-clamp-2 flex-1 text-base font-bold">{post.title}</h3>
        {post.summary && (
          <p className="text-fg-muted mb-4 line-clamp-2 text-sm leading-relaxed">{post.summary}</p>
        )}
        <a
          href={post.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
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
