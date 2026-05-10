import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { NAVER } from '@/lib/constants';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: '갤러리',
  description:
    '한라산출장바베큐 행사 사진과 후기. 네이버 블로그에서 자동 동기화됩니다.',
  path: '/gallery',
});

export default async function GalleryPage() {
  const posts = await fetchNaverBlogRss(NAVER.blogId).catch(() => []);

  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-20 bg-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-4">
            갤러리
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4 leading-tight">
            현장 사진
          </h1>
          <p className="text-cream/60 text-lg max-w-2xl">
            최근 행사 및 메뉴 사진입니다. 네이버 블로그 새 글이 자동으로 추가됩니다.
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-24 text-muted">
              아직 등록된 글이 없습니다. 곧 첫 사진을 만나보실 수 있어요.
            </div>
          ) : (
            <GalleryGrid posts={posts} />
          )}
        </div>
      </section>

      {/* Blog link */}
      <section className="py-12 bg-warm-100">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-muted text-base mb-4">
            더 많은 사진과 행사 후기는 네이버 블로그에서 확인하세요
          </p>
          <a
            href={NAVER.blogHomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#03C75A] text-white font-semibold rounded-full h-12 px-8 hover:bg-[#02a84c] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            네이버 블로그 방문하기
          </a>
        </div>
      </section>
    </>
  );
}
