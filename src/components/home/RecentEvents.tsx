import Image from 'next/image';
import type { GalleryPost } from '@/types';
import { shortenBlogTitle } from '@/lib/blog/display-title';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

/**
 * 메인 '이런 자리에서 함께했습니다' 목록.
 * 모바일: 작은 사진 + 제목의 가로형 카드 / sm 이상: 사진 카드 그리드.
 * 제목은 블로그 RSS 제목을 shortenBlogTitle로 자동 정리해 보여준다.
 */
export default function RecentEvents({ posts }: { posts: GalleryPost[] }) {
  if (posts.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {posts.map((post) => {
        const title = shortenBlogTitle(post.title);
        return (
          <li key={post.id}>
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} 현장 후기 (네이버 블로그)`}
              className="group border-border flex items-center gap-3.5 rounded-2xl border bg-white p-2.5 sm:block sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
            >
              <span className="bg-surface-3 relative block h-[84px] w-28 shrink-0 overflow-hidden rounded-[10px] sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-xl">
                {post.thumbnailUrl ? (
                  <Image
                    src={post.thumbnailUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width:639px) 112px, 400px"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </span>
              <span className="flex min-w-0 flex-col gap-1 sm:pt-4">
                <span className="text-fg line-clamp-2 text-[15px] leading-snug font-bold sm:order-2 sm:text-base">
                  {title}
                </span>
                <time dateTime={post.publishedAt} className="text-fg-muted text-xs sm:order-1">
                  {formatDate(post.publishedAt)} · 출장 바베큐
                </time>
                <span className="text-brand text-[13px] font-semibold sm:order-3 sm:mt-1 sm:text-sm">
                  현장 후기 보기 ↗
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
