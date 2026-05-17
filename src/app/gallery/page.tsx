import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { NAVER } from '@/lib/constants';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

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
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '갤러리', path: '/gallery' }]} />

      {/* Page hero — dark */}
      <section className="bg-surface-2 py-16 md:py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand font-semibold text-xs uppercase tracking-widest mb-3">
            EVENT GALLERY
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4 leading-tight">
            행사 갤러리
          </h1>
          <p className="text-fg-soft text-lg max-w-2xl">
            실제 행사 사진과 후기. 네이버 블로그에서 자동 동기화됩니다.
          </p>
        </div>
      </section>

      {/* Gallery section */}
      <section className="py-16 md:py-20 bg-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-24 text-fg-muted">
              <p className="text-4xl mb-4" aria-hidden="true">📷</p>
              <p className="text-lg mb-4">아직 등록된 글이 없습니다. 곧 첫 사진을 만나보실 수 있어요.</p>
              <a
                href={NAVER.blogHomeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand font-semibold hover:underline"
              >
                네이버 블로그 바로가기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
          ) : (
            <GalleryGrid posts={posts} />
          )}
        </div>
      </section>

      {/* Bottom CTA banner — orange */}
      <section className="py-14 bg-brand">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-white font-bold text-xl mb-2">지금 바로 행사 예약하세요</p>
          <p className="text-white/80 text-sm mb-6">행사 규모·장소·날짜를 알려주시면 맞춤 제안을 드립니다.</p>
          <a
            href={NAVER.blogHomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-brand font-semibold rounded-full h-12 px-8 hover:bg-fg-soft transition-colors"
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
