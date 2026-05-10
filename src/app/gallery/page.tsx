import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { NAVER } from '@/lib/constants';
import type { GalleryPost } from '@/types';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const metadata: Metadata = pageMetadata({
  title: '갤러리',
  description:
    '한라산출장바베큐 갤러리. 기업 워크샵, 가족 모임, 야외 행사 등 실제 출장 현장 사진과 직화구이 메뉴 사진을 확인하세요.',
  path: '/gallery',
});

// Demo posts — Phase 2 will replace with RSS-driven data
const DEMO_POSTS: GalleryPost[] = [
  {
    id: 'post-1',
    title: '제주 기업 워크샵 출장 바베큐 후기',
    summary: '50명 규모 기업 워크샵 현장. 제주 흑돼지와 한우를 직화로 구워 드렸습니다. 탁 트인 야외에서 즐기는 직화구이의 감동.',
    thumbnailUrl: null,
    originalUrl: `https://blog.naver.com/${NAVER.blogId}`,
    publishedAt: '2025-04-20T10:00:00+09:00',
  },
  {
    id: 'post-2',
    title: '가족 나들이 소규모 바베큐 파티',
    summary: '10인 가족 모임을 위한 소규모 출장 케이터링. 아이들과 함께하는 신나는 바베큐 파티 현장을 담았습니다.',
    thumbnailUrl: null,
    originalUrl: `https://blog.naver.com/${NAVER.blogId}`,
    publishedAt: '2025-03-15T11:00:00+09:00',
  },
  {
    id: 'post-3',
    title: '동호회 봄 나들이 바베큐',
    summary: '30명 동호회 봄 나들이 행사. 모듬 버섯구이, 흑돼지 오겹살, 한우 갈빗살까지 다양하게 즐기셨습니다.',
    thumbnailUrl: null,
    originalUrl: `https://blog.naver.com/${NAVER.blogId}`,
    publishedAt: '2025-02-28T12:00:00+09:00',
  },
  {
    id: 'post-4',
    title: '한라산 한우 안심 스테이크 — 신메뉴 소개',
    summary: '새롭게 추가된 한우 안심 스테이크 메뉴. 미디엄으로 직화 마감해 드리는 부드러운 안심의 풍미를 소개합니다.',
    thumbnailUrl: null,
    originalUrl: `https://blog.naver.com/${NAVER.blogId}`,
    publishedAt: '2025-01-10T09:00:00+09:00',
  },
  {
    id: 'post-5',
    title: '제주 흑돼지 오겹살 직화구이 현장',
    summary: '제주 현지 직거래 흑돼지 오겹살을 숯불에 두툼하게 굽는 현장. 껍데기까지 바삭하게 완성되는 과정을 담았습니다.',
    thumbnailUrl: null,
    originalUrl: `https://blog.naver.com/${NAVER.blogId}`,
    publishedAt: '2024-12-22T14:00:00+09:00',
  },
  {
    id: 'post-6',
    title: '연말 기업 송년회 출장 케이터링',
    summary: '80명 규모 기업 송년회 행사. 풀 코스 세팅부터 정리까지 한라산출장바베큐가 책임졌습니다.',
    thumbnailUrl: null,
    originalUrl: `https://blog.naver.com/${NAVER.blogId}`,
    publishedAt: '2024-12-05T18:00:00+09:00',
  },
];

export default function GalleryPage() {
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
          <GalleryGrid posts={DEMO_POSTS} />
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
