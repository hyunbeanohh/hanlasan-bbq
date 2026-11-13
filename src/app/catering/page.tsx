import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MENU_ITEMS } from '@/data/menu';
import { MENU_PAGES } from '@/data/menu-pages';
import { COMMON_FAQ, type FaqItem } from '@/data/faq';
import { PROCESS_STEPS } from '@/data/company';
import { NAVER } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo/metadata';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import RecentEvents from '@/components/home/RecentEvents';
import FaqList from '@/components/common/FaqList';
import CallButton from '@/components/cta/CallButton';
import SmsButton from '@/components/cta/SmsButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import FaqJsonLd from '@/components/seo/FaqJsonLd';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: '기업 행사 출장 바베큐 케이터링 (워크숍, 체육대회, 야유회)',
  description:
    '기업 워크숍, 체육대회, 야유회, 동문회에 찾아가는 출장 바베큐 케이터링. 대표가 직접 행사장에서 통돼지, 통삼겹살, 해물 바베큐를 굽고 세팅부터 정리까지 맡습니다. 인원별 가격과 진행 순서 안내.',
  path: '/catering',
});

const EVENT_TYPES = [
  '기업 워크숍',
  '체육대회',
  '야유회',
  '동문회',
  '대학 축제',
  '교회와 성당 행사',
  '군부대 행사',
  '가족 잔치',
];

const PROMISES = [
  {
    title: '대표가 직접 갑니다',
    body: '외주나 아르바이트를 보내지 않습니다. 세팅부터 조리, 정리까지 대표가 직접 맡습니다.',
  },
  {
    title: '급하게 굽지 않습니다',
    body: '참나무로 2시간 넘게 천천히 훈연합니다. 행사 시작 최소 2시간 전에 도착합니다.',
  },
  {
    title: '장비를 싣고 갑니다',
    body: '그릴, 식기, 테이블까지 저희가 준비합니다.',
  },
  {
    title: '정리까지 끝냅니다',
    body: '식사가 끝나면 잔반, 그릴, 식기를 정리하고 현장을 원래대로 돌려놓습니다.',
  },
];

const CATERING_FAQ: FaqItem[] = [
  [
    '펜션이나 야외 행사장도 가능한가요?',
    '네, 행사장으로 직접 찾아갑니다. 장소와 인원을 알려주시면 진행 가능 여부를 상담 후 안내합니다.',
  ],
  [
    '식사도 함께 준비되나요?',
    '빠른 견적에서 식사 포함 여부를 고르실 수 있습니다. 구성은 상담 후 안내해 드립니다.',
  ],
];

export default async function CateringPage() {
  const posts = await fetchNaverBlogRss(NAVER.blogId).catch(() => []);
  const faq = [...CATERING_FAQ, ...COMMON_FAQ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '기업 행사 케이터링', path: '/catering' },
        ]}
      />
      <FaqJsonLd items={faq} />

      <header className="site-width page-heading">
        <h1>기업 행사 출장 바베큐 케이터링</h1>
        <p>
          워크숍, 체육대회, 야유회, 동문회까지. 대표가 직접 행사장에 찾아가 바베큐를 굽고, 세팅부터
          정리까지 맡습니다.
        </p>
      </header>

      <div className="site-width">
        <div className="flex flex-wrap gap-3">
          <a
            href="/inquiry#quote"
            className="bg-brand inline-flex h-12 items-center rounded-full px-6 font-semibold text-white md:h-14 md:px-8"
          >
            행사 견적 받기
          </a>
          <CallButton variant="ghost">전화 상담</CallButton>
        </div>

        <section className="py-10">
          <h2 className="mb-6 text-2xl font-bold">이런 행사에 찾아갑니다</h2>
          <ul className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <li key={t} className="bg-surface rounded-full px-4 py-2 text-sm font-semibold">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-border border-t py-10">
          <h2 className="mb-6 text-2xl font-bold">한라산출장바베큐가 약속하는 것</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <li key={p.title} className="bg-surface rounded-2xl p-5">
                <p className="mb-2 font-bold">{p.title}</p>
                <p className="text-fg-soft text-sm leading-6">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-border border-t py-10">
          <h2 className="mb-2 text-2xl font-bold">행사 메뉴</h2>
          <p className="text-fg-muted mb-6 text-sm">
            메뉴를 누르면 인원별 가격과 자세한 내용을 볼 수 있습니다.
          </p>
          <ul className="grid gap-6 md:grid-cols-3">
            {MENU_PAGES.map((p) => {
              const item = MENU_ITEMS.find((m) => m.id === p.menuId);
              if (!item) return null;
              return (
                <li key={p.slug}>
                  <Link href={`/menu/${p.slug}`} className="group block">
                    <span className="bg-surface-3 relative block aspect-[3/2] overflow-hidden rounded-xl">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width:767px) 100vw, 400px"
                      />
                    </span>
                    <span className="mt-3 block text-lg font-bold">{p.heading}</span>
                    <span className="text-fg-soft mt-1 block text-sm leading-6">{p.lead}</span>
                    <span className="text-brand mt-2 block text-sm font-semibold">
                      인원별 가격 보기 →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="border-border border-t py-10">
          <h2 className="mb-6 text-2xl font-bold">진행 순서</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s) => (
              <li key={s.step} className="border-border rounded-2xl border p-5">
                <p className="text-brand mb-1 text-sm font-bold">{s.step}단계</p>
                <p className="mb-2 font-bold">{s.title}</p>
                <p className="text-fg-soft text-sm leading-6">{s.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {posts.length > 0 && (
          <section className="border-border border-t py-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold">최근 함께한 행사</h2>
              <Link href="/gallery" className="text-sm underline underline-offset-4">
                행사 기록 더 보기 →
              </Link>
            </div>
            <RecentEvents posts={posts.slice(0, 6)} />
          </section>
        )}

        <section className="border-border border-t py-10">
          <h2 className="mb-4 text-2xl font-bold">자주 묻는 질문</h2>
          <FaqList items={faq} />
        </section>
      </div>

      <section className="bg-surface mt-6 py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-fg mb-2 text-xl font-bold">행사 날짜와 인원만 알려주세요</p>
          <p className="text-fg-soft mb-8">
            장소와 메뉴를 확인해 견적과 진행 가능 여부를 안내해 드립니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/inquiry#quote"
              className="bg-brand inline-flex h-12 items-center rounded-full px-6 font-semibold text-white md:h-14 md:px-8"
            >
              견적 받기
            </a>
            <CallButton variant="ghost" />
            <SmsButton variant="ghost" />
          </div>
        </div>
      </section>
    </>
  );
}
