import Link from 'next/link';
import PageHeading from '@/components/layout/PageHeading';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { NAVER } from '@/lib/constants';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: '갤러리',
  description: '한라산출장바베큐 행사 사진과 후기. 실제 행사 준비 모습을 확인하세요.',
  path: '/gallery',
});

export default async function GalleryPage() {
  const posts = await fetchNaverBlogRss(NAVER.blogId).catch(() => []);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '갤러리', path: '/gallery' },
        ]}
      />

      {/* Page hero — dark */}
      <PageHeading
        title="행사 기록"
        description="기업 행사부터 가족 모임까지, 현장에서 준비한 모습을 만나보세요."
      />

      {/* Gallery section */}
      <section className="page-content">
        <div className="site-width">
          {posts.length === 0 ? (
            <div className="text-fg-muted py-24 text-center">
              <p className="mb-4 text-lg">
                아직 등록된 글이 없습니다. 곧 첫 사진을 만나보실 수 있어요.
              </p>
              <a
                href={NAVER.blogHomeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand inline-flex items-center gap-1.5 font-semibold hover:underline"
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
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-fg mb-2 text-xl font-bold">지금 바로 행사 예약하세요</p>
          <p className="text-fg-soft mb-6 text-sm">
            행사 규모·장소·날짜를 알려주시면 맞춤 제안을 드립니다.
          </p>
          <Link
            href="/inquiry"
            className="text-brand hover:bg-fg-soft inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 font-semibold transition-colors"
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
            견적 문의하기
          </Link>
        </div>
      </section>
    </>
  );
}
