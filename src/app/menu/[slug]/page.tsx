import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MENU_ITEMS } from '@/data/menu';
import { MENU_PAGES, getMenuPage } from '@/data/menu-pages';
import { COMMON_FAQ } from '@/data/faq';
import { CONTACT, NAVER, SITE } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo/metadata';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import { PricingTable } from '@/components/menu/MenuCard';
import RecentEvents from '@/components/home/RecentEvents';
import FaqList from '@/components/common/FaqList';
import CallButton from '@/components/cta/CallButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import FaqJsonLd from '@/components/seo/FaqJsonLd';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MENU_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getMenuPage(slug);
  const item = page && MENU_ITEMS.find((m) => m.id === page.menuId);
  if (!page || !item) return {};
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/menu/${page.slug}`,
    ogImage: item.imageSrc,
  });
}

/** 가격표에서 최저가와 최고가(원)를 뽑는다. 구조화 데이터용. */
function priceRange(values: (string | undefined)[]): { low: number; high: number } | null {
  const nums = values
    .map((v) => (v ? Number(v.replace(/[^0-9]/g, '')) : NaN))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length === 0) return null;
  return { low: Math.min(...nums), high: Math.max(...nums) };
}

const STEPS: [string, string][] = [
  ['상담', '날짜, 장소, 인원을 알려주시면 견적과 가능 여부를 안내합니다.'],
  ['메뉴와 인원 확정', '예산과 취향에 맞춰 메뉴와 구성을 확정합니다.'],
  ['당일 세팅과 조리', '행사 시작 최소 2시간 전에 도착해 준비와 세팅을 진행합니다.'],
  ['정리', '식사가 끝나면 잔반, 그릴, 식기를 정리합니다.'],
];

export default async function MenuDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getMenuPage(slug);
  const item = page && MENU_ITEMS.find((m) => m.id === page.menuId);
  if (!page || !item) notFound();

  const posts = await fetchNaverBlogRss(NAVER.blogId).catch(() => []);
  const faq = [...page.faq, ...COMMON_FAQ];
  const tiers = item.pricingTiers ?? [];
  const range = priceRange(tiers.flatMap((t) => [t.price, t.priceAlt]));
  const pageUrl = `${SITE.canonicalOriginDisplay}/menu/${page.slug}`;
  const otherPages = MENU_PAGES.filter((p) => p.slug !== page.slug);

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.heading,
    serviceType: '출장 바베큐 케이터링',
    description: page.metaDescription,
    url: pageUrl,
    image: `${SITE.canonicalOriginDisplay}${item.imageSrc}`,
    areaServed: { '@type': 'Country', name: '대한민국' },
    provider: { '@id': `${SITE.canonicalOriginDisplay}#business` },
    ...(range
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'KRW',
            lowPrice: range.low,
            highPrice: range.high,
            url: pageUrl,
          },
        }
      : {}),
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '메뉴', path: '/menu' },
          { name: page.heading, path: `/menu/${page.slug}` },
        ]}
      />
      <FaqJsonLd items={faq} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <div className="site-width pt-10 pb-4 md:pt-14">
        <nav aria-label="위치" className="text-fg-muted mb-6 text-sm">
          <Link href="/" className="hover:text-brand">
            홈
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/menu" className="hover:text-brand">
            출장 바베큐 메뉴
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-fg">{item.name}</span>
        </nav>

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="bg-surface-3 relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={item.imageSrc}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width:767px) 100vw, 580px"
              preload
            />
          </div>
          <div>
            <p className="text-brand mb-2 text-sm font-semibold">한라산출장바베큐 시그니처</p>
            <h1 className="mb-4 text-[clamp(28px,4vw,40px)] leading-tight font-bold">
              {page.heading}
            </h1>
            <p className="text-fg mb-4 text-lg font-semibold">{page.lead}</p>
            {page.intro.map((p) => (
              <p key={p} className="text-fg-soft mb-3 leading-7">
                {p}
              </p>
            ))}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/inquiry?menu=${encodeURIComponent(page.quoteMenu)}#quote`}
                className="bg-brand inline-flex h-12 items-center rounded-full px-6 font-semibold text-white md:h-14 md:px-8"
              >
                이 메뉴로 견적 받기
              </a>
              <CallButton variant="ghost">전화 상담</CallButton>
            </div>
          </div>
        </div>
      </div>

      <div className="site-width">
        <section className="border-border mt-10 border-t py-10">
          <h2 className="mb-6 text-2xl font-bold">이런 점이 다릅니다</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {page.points.map((pt) => (
              <li key={pt.title} className="bg-surface rounded-2xl p-5">
                <p className="mb-2 font-bold">{pt.title}</p>
                <p className="text-fg-soft text-sm leading-6">{pt.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {tiers.length > 0 && (
          <section className="border-border border-t py-10" id="price">
            <h2 className="mb-2 text-2xl font-bold">{item.name} 인원별 가격</h2>
            <p className="text-fg-muted mb-6 text-sm">
              인원이 다르거나 다른 메뉴와 함께 준비하시려면 견적으로 문의해 주세요. 상담{' '}
              {CONTACT.phone}
            </p>
            <div className="max-w-xl">
              <PricingTable tiers={tiers} columns={item.priceColumns} />
            </div>
          </section>
        )}

        <section className="border-border border-t py-10">
          <h2 className="mb-6 text-2xl font-bold">진행 순서</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="border-border rounded-2xl border p-5">
                <p className="text-brand mb-1 text-sm font-bold">{i + 1}단계</p>
                <p className="mb-2 font-bold">{title}</p>
                <p className="text-fg-soft text-sm leading-6">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {posts.length > 0 && (
          <section className="border-border border-t py-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold">최근 다녀온 행사</h2>
              <Link href="/gallery" className="text-sm underline underline-offset-4">
                행사 기록 더 보기 →
              </Link>
            </div>
            <RecentEvents posts={posts.slice(0, 3)} />
          </section>
        )}

        <section className="border-border border-t py-10">
          <h2 className="mb-4 text-2xl font-bold">자주 묻는 질문</h2>
          <FaqList items={faq} />
        </section>

        <section className="border-border border-t pt-10 pb-16">
          <h2 className="mb-6 text-2xl font-bold">다른 메뉴도 살펴보세요</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/menu/${p.slug}`}
                  className="border-border hover:border-brand block rounded-2xl border p-5"
                >
                  <p className="font-bold">{p.heading}</p>
                  <p className="text-fg-soft mt-1 text-sm">{p.lead}</p>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/catering"
                className="border-border hover:border-brand block rounded-2xl border p-5"
              >
                <p className="font-bold">기업 행사 출장 바베큐 케이터링</p>
                <p className="text-fg-soft mt-1 text-sm">워크숍, 체육대회, 야유회 진행 안내</p>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
