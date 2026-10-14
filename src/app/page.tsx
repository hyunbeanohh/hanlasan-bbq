import Link from 'next/link';
import EditorialHero from '@/components/home/EditorialHero';
import QuickQuoteForm from '@/components/home/reservation/QuickQuoteForm';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { MENU_ITEMS } from '@/data/menu';
import { NAVER } from '@/lib/constants';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import Image from 'next/image';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

const homeTitle = '전국 출장 바베큐 · 통돼지·통삼겹살·해물 | 한라산출장바베큐';

export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description:
      '한라산출장바베큐가 전국 기업 행사·동문회·가족 모임에 찾아갑니다. 통돼지, 통삼겹살, 해물바베큐와 식사 포함 여부를 선택하고 행사 인원·날짜·장소에 맞는 견적을 문의하세요.',
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
      .map((post) => ({ src: post.thumbnailUrl!, title: post.title })),
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
                <Link href={`/menu#${item.id}`}>
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
          <GalleryGrid posts={posts.slice(0, 3)} />
        </section>
        <section className="border-border border-t pt-10 pb-16">
          <h2 className="mb-8 text-3xl font-bold">자주하는 질문</h2>
          {FAQ.map(([q, a]) => (
            <details key={q} className="border-border group border-b py-5">
              <summary className="flex cursor-pointer justify-between gap-4 font-semibold">
                {q}
                <span aria-hidden="true" className="group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="text-fg-soft pt-4 leading-7">{a}</p>
            </details>
          ))}
        </section>
      </div>
    </>
  );
}
const FAQ = [
  [
    '행사 당일 준비는 어떻게 진행되나요?',
    '행사 시작 최소 2시간 전에 도착해 바베큐 준비와 자리 세팅을 진행합니다.',
  ],
  [
    '메뉴 변경이나 맞춤 구성이 가능한가요?',
    '네, 전화 상담을 통해 원하시는 메뉴와 구성을 협의한 후 진행합니다.',
  ],
  [
    '출장 지역에 제한이 있나요?',
    '지역 제한은 없습니다. 행사 인원과 메뉴를 고려해 진행 가능 여부를 상담 후 안내합니다.',
  ],
  [
    '몇 명부터 이용할 수 있나요?',
    '기본 30명 이상부터 가능합니다. 30명 미만도 메뉴와 구성에 따라 전화로 상담해 주세요.',
  ],
  ['얼마나 전에 예약해야 하나요?', '행사 최소 1주일 전에는 예약해 주세요.'],
];
