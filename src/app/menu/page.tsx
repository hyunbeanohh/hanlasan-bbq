import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs';
import CallButton from '@/components/cta/CallButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = pageMetadata({
  title: '메뉴소개',
  description:
    '한라산출장바베큐 메뉴 안내. 시그니처 코스, 한우, 제주 흑돼지, 사이드까지 — 제주 직거래 식재료로 만드는 프리미엄 출장 바베큐 메뉴.',
  path: '/menu',
});

export default function MenuPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '메뉴', path: '/menu' }]} />

      {/* Page hero — light warm gradient */}
      <section className="relative overflow-hidden bg-warm-100 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand font-semibold text-xs uppercase tracking-widest mb-3">
            MENU DETAILS
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4 leading-tight">
            메뉴 소개
          </h1>
          <p className="text-ink-soft text-lg max-w-2xl">
            특별한 날을 위한 시그니처 메뉴 — 제주 직거래 한우·흑돼지·해산물을 숯불로 직접 구워 드립니다.
          </p>
        </div>
      </section>

      {/* Category tabs + menu list */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MenuCategoryTabs />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-brand-soft">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-ink font-bold text-xl mb-2">
            찾으시는 메뉴가 없으신가요?
          </p>
          <p className="text-ink-soft mb-8">
            인원수·장소·예산을 알려주시면 맞춤 메뉴를 제안해 드립니다.
          </p>
          <CallButton variant="primary">전화 문의</CallButton>
        </div>
      </section>
    </>
  );
}
