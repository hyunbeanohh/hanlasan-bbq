import Link from 'next/link';
import EditorialHero from '@/components/home/EditorialHero';
import QuickQuoteForm from '@/components/home/reservation/QuickQuoteForm';
import RecentEvents from '@/components/home/RecentEvents';
import { shortenBlogTitle } from '@/lib/blog/display-title';
import { MENU_ITEMS } from '@/data/menu';
import { NAVER } from '@/lib/constants';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import Image from 'next/image';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { COMMON_FAQ } from '@/data/faq';
import { getMenuPageByMenuId } from '@/data/menu-pages';
import FaqList from '@/components/common/FaqList';
import FaqJsonLd from '@/components/seo/FaqJsonLd';

export const revalidate = 3600;

const homeTitle = '통돼지바베큐 출장 · 전국 출장바베큐 케이터링 | 한라산출장바베큐';

export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description:
      '통돼지바베큐·통삼겹살 출장바베큐 전문. 참숯으로 행사장에서 직접 구워 드리고 반찬과 식기 세팅까지 준비합니다. 기업 워크숍, 행사 케이터링, 가족 잔치까지 전국 출장. 인원·날짜·장소만 알려주시면 견적을 안내합니다.',
    path: '/',
  }),
  title: { absolute: homeTitle },
};

export default async function HomePage() {
  const posts = await fetchNaverBlogRss(NAVER.blogId).catch(() => []);
  const slides = [
    { src: '/images/menu/tongsamgyeop-v2.jpg', title: '통삼겹살 바베큐' },
    ...posts
      .filter((post) => post.thumbnailUrl)
      .slice(0, 9)
      .map((post) => ({ src: post.thumbnailUrl!, title: shortenBlogTitle(post.title) })),
  ];
  return (
    <>
      <EditorialHero slides={slides} />
      <div className="site-width">
        <section className="py-12" id="quick-quote">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            행사에 맞는 바베큐 <span className="text-brand ml-2 text-lg">빠른 견적</span>
          </h2>
          <QuickQuoteForm siteKey={process.env.TURNSTILE_SITE_KEY ?? ''} />
        </section>
        <section className="border-border border-t py-12" id="records">
          <h2 className="mb-3 text-[clamp(23px,3vw,32px)] font-bold">
            이런 자리에서 함께했습니다.
          </h2>
          <p className="text-fg-muted">행사별 준비 모습은 블로그에서 확인하실 수 있습니다.</p>
          <a
            href={NAVER.blogHomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 mb-8 inline-block text-sm underline underline-offset-4"
          >
            블로그로 바로가기 ↗
          </a>
          <RecentEvents posts={posts.slice(0, 3)} />
        </section>
        <section className="border-border border-t py-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold">대표 메뉴</h2>
            <Link href="/menu" className="text-sm underline underline-offset-4">
              메뉴 자세히 보기 →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {MENU_ITEMS.slice(0, 3).map((item) => (
              <article key={item.id}>
                <Link href={menuHref(item.id)}>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:767px) 100vw,400px"
                    />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{item.name}</h3>
                </Link>
                <p className="text-fg-soft mt-2 text-sm leading-6">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="border-border border-t pt-10 pb-16">
          <h2 className="mb-8 text-3xl font-bold">자주하는 질문</h2>
          <FaqJsonLd items={COMMON_FAQ} />
          <FaqList items={COMMON_FAQ} />
          <p className="text-fg-soft mt-8 text-sm">
            회사 워크숍이나 체육대회를 준비하신다면{' '}
            <Link href="/catering" className="text-brand font-semibold underline underline-offset-4">
              기업 행사 케이터링 안내
            </Link>
            를 확인해 보세요.
          </p>
        </section>
      </div>
    </>
  );
}

/** 대표 메뉴 카드 링크: 상세 페이지가 있으면 상세로, 없으면 메뉴 페이지의 해당 위치로. */
function menuHref(menuId: string): string {
  const detail = getMenuPageByMenuId(menuId);
  return detail ? `/menu/${detail.slug}` : `/menu#${menuId}`;
}
