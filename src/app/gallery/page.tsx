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

      {/* Hero */}
      <section className="py-20 px-6 md:px-12 text-center max-w-4xl mx-auto pt-[120px]">
        <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-6 block">
          EVENT GALLERY
        </span>
        <h1
          className="text-5xl md:text-6xl font-black text-white uppercase mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-headline)', letterSpacing: '-0.02em' }}
        >
          현장의 순간들
        </h1>
        <p className="text-[#c8c6c5] text-lg max-w-2xl mx-auto leading-relaxed">
          기업 행사부터 가족 나들이까지, 직화의 순간을 담은 갤러리입니다.
          최근 행사 및 메뉴 사진이 네이버 블로그에서 자동으로 동기화됩니다.
        </p>
      </section>

      {/* Gallery grid */}
      <section className="py-[120px] bg-[#121414]">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          {posts.length === 0 ? (
            <>
              {/* Empty state with placeholder bento grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px] mb-16">
                {/* Large feature */}
                <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-[#1e2020] border border-white/5">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 80%, rgba(249,94,20,0.4) 0%, transparent 70%)',
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-end justify-end p-8">
                    <span className="text-[#ffb59a] text-xs font-bold uppercase tracking-widest mb-2">기업 행사</span>
                    <h3 className="text-white font-bold text-xl">[사진 준비중]</h3>
                  </div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden bg-[#1e2020] border border-white/5"
                  >
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        background:
                          'radial-gradient(ellipse at 50% 80%, rgba(249,94,20,0.3) 0%, transparent 70%)',
                      }}
                    />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-zinc-600 text-xs">[사진 준비중]</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-zinc-500 text-base">
                아직 등록된 글이 없습니다. 곧 첫 사진을 만나보실 수 있어요.
              </p>
            </>
          ) : (
            <GalleryGrid posts={posts} />
          )}
        </div>
      </section>

      {/* Blog link */}
      <section className="py-[120px] bg-[#1a1c1c]">
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
          <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-4 block">
            MORE MOMENTS
          </span>
          <h2
            className="text-2xl md:text-3xl font-black text-white uppercase mb-6"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            더 많은 사진 보기
          </h2>
          <p className="text-zinc-400 text-base mb-8">
            더 많은 사진과 행사 후기는 네이버 블로그에서 확인하세요
          </p>
          <a
            href={NAVER.blogHomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border-2 border-[#ffb59a] text-[#ffb59a] px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#ffb59a] hover:text-black transition-all duration-300"
          >
            네이버 블로그 방문하기
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
          </a>
        </div>
      </section>
    </>
  );
}
