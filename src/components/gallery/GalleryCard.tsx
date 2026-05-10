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
    <article className="rounded-xl overflow-hidden bg-white border border-warm-100 hover:shadow-lg transition-shadow flex flex-col">
      {/* Thumbnail placeholder */}
      <div className="aspect-[4/3] bg-warm-100 flex flex-col items-center justify-center gap-2 shrink-0">
        <span className="text-5xl" aria-hidden="true">📸</span>
        <p className="text-muted text-xs">사진 준비중</p>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <time
          dateTime={post.publishedAt}
          className="text-xs text-muted mb-2 block"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="font-bold text-ink text-base mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-muted text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
          {post.summary}
        </p>
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
